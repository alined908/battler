from django.db import models
from .user import User
from .enums import BattleSize, TournamentPrivacy, GameSize
from .utils import Timestamps, generate_random_hash
from django.contrib.sessions.models import Session
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.postgres.search import SearchVector
from taggit.managers import TaggableManager
from django.utils.translation import ugettext_lazy as _
import uuid
import random

def tournament_photo_directory(instance, filename):
    return f'uploads/tournaments/{instance.tournament.url}/{instance.id}'

def tournament_avatar_directory(instance, filename):
    return f'uploads/tournaments/{instance.url}/avatar'

class TournamentManager(models.Manager):

    def search(self, query):
        tournaments = self.annotate(
            search=SearchVector('title', 'description')
        ).filter(search__icontains=query)
        return tournaments

class Tournament(Timestamps):
    url = models.URLField(default=generate_random_hash, unique=True)
    avatar = models.FileField(upload_to=tournament_avatar_directory, null=True, blank=True)
    description = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    creator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    password = models.CharField(max_length=32, null=True, blank=True)
    privacy = models.IntegerField(choices=TournamentPrivacy.choices(), default=TournamentPrivacy.PUBLIC)
    is_nsfw = models.BooleanField()
    tags = TaggableManager(blank=True)

    objects = TournamentManager()

class TournamentEntry(Timestamps):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    photo = models.FileField(upload_to=tournament_photo_directory)

class Game(Timestamps):
    tournament = models.ForeignKey(Tournament, on_delete=models.SET_NULL, null=True, blank=True)
    session = models.ForeignKey(Session, on_delete=models.DO_NOTHING)
    player = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    bracket_size = models.IntegerField()
    curr_round = models.IntegerField()
    game_size = models.IntegerField(choices=GameSize.choices())
    winner = models.ForeignKey(TournamentEntry, on_delete=models.SET_NULL, null=True, blank=True, related_name='winners')
    curr_battle = models.IntegerField(default=0)
    is_gameend = models.BooleanField(default=False)
    entries = models.ManyToManyField(TournamentEntry)

    def save(self, *args, **kwargs):
        if not self.pk:
            self.curr_round = self.bracket_size

        if self.curr_battle == self.curr_round // self.game_size:
            self.advance_round()
        super(Game, self).save(*args, **kwargs)

    def advance_round(self):
        """
        Advance round if all battles determined
        """
        # If on round of game_size, advance to round of 1
        if self.curr_round == self.game_size:
            self.curr_round = 1
            self.save()
            return

        self.curr_round = self.curr_round//self.game_size
        # Create next round and generate battles
        next_round = Round.objects.create(game=self, round_num=self.curr_round)
        next_round.generate_battles()
        self.curr_battle = 0
        self.save()

    def current_battles(self):
        """
        Get all battles of current round for serializer
        """
        battles = []

        if self.curr_round != 1:
            battles = Battle.objects.filter(round__round_num=self.curr_round, winner=None)

        return battles

class Round(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    round_num = models.IntegerField()

    def generate_battles(self):
        """
        Generate set of battles each round change
        """
        game_size = self.game.game_size

        if self.round_num == self.game.bracket_size:
            options = list(TournamentEntry.objects.filter(tournament=self.game.tournament))
            random.shuffle(options)

            for i in range(0, len(options), game_size):
                battle = Battle.objects.create(round=self, battle_index=i//game_size)
                battle.entries.set(options[i: i + self.game.game_size])
        else:
            battle_entries = []
            battle_counter = 0
        
            while battle_counter <= self.round_num:

                if battle_counter != 0 and battle_counter % game_size == 0:
                    next_battle = Battle.objects.create(round=self, battle_index=battle_counter//game_size - 1)
                    next_battle.entries.set(battle_entries)
                    battle_entries = []

                if battle_counter == self.round_num:
                    break

                prev_battle = Battle.objects.get(round__round_num=self.round_num * game_size, battle_index=battle_counter)
                battle_entries.append(prev_battle.winner)
                battle_counter += 1

class Battle(models.Model):
    round = models.ForeignKey(Round, on_delete=models.CASCADE, related_name='battles')
    battle_index = models.IntegerField()
    entries = models.ManyToManyField(TournamentEntry)
    winner = models.ForeignKey(TournamentEntry, on_delete=models.CASCADE, related_name="wins", null=True, blank=True)

@receiver(post_save, sender=Battle)
def advance_game(sender, instance, created, **kwargs):
    # If winner for battle picked, advanced game current battle
    if instance.winner:
        instance.round.game.curr_battle += 1
        #If last battle declare game winner
        if instance.round.round_num == instance.round.game.game_size:
            instance.round.game.winner = instance.winner

        instance.round.game.save()

@receiver(post_save, sender=Game)
def assign_entities(sender, instance, created, **kwargs):
    if created:
        entries = list(TournamentEntry.objects.filter(tournament=instance.tournament).values_list('id', flat=True))
        random_entries = random.sample(entries, instance.bracket_size)
        selected_entries = TournamentEntry.objects.filter(id__in=random_entries)
        instance.entries.set(selected_entries)
        start_round = Round.objects.create(game=instance, round_num=instance.bracket_size)
        start_round.generate_battles()

@receiver(post_delete, sender=TournamentEntry)
def remove_file_from_s3(sender, instance, **kwargs):
    instance.photo.delete()