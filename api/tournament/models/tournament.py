from django.db import models
from .user import User
from .enums import BracketTypes, BattleSize, TournamentPrivacy
from .utils import Timestamps, generate_random_hash
from django.contrib.sessions.models import Session
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.postgres.search import SearchVector
import uuid
import random

def tournament_photo_directory(instance, filename):
    return f'uploads/tournaments/{instance.tournament.id}/{instance.id}'

def tournament_avatar_directory(instance, filename):
    return f'uploads/tournaments/{instance.tournament.id}/avatar'

class TournamentManager(models.Manager):

    def search(self, query):
        tournaments = self.annotate(
            search=SearchVector('title', 'description')
        ).filter(search__icontains=query)
        return tournaments

class Tournament(Timestamps):
    id = models.SlugField(primary_key=True, default=generate_random_hash, editable=True, unique=True)
    avatar = models.FileField(upload_to=tournament_avatar_directory)
    description = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    creator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    password = models.CharField(max_length=32, null=True, blank=True)
    privacy = models.IntegerField(choices=TournamentPrivacy.choices(), default=TournamentPrivacy.PUBLIC)
    is_nsfw = models.BooleanField()

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
    bracket_size = models.IntegerField(choices=BracketTypes.choices())
    curr_round = models.IntegerField(choices=BracketTypes.choices())
    winner = models.ForeignKey(TournamentEntry, on_delete=models.SET_NULL, null=True, blank=True)
    curr_battle = models.IntegerField(default=0)
    is_gameend = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.pk:
            self.curr_round = self.bracket_size

        if self.curr_battle == self.curr_round // 2:
            self.advance_round()
        super(Game, self).save(*args, **kwargs)

    def advance_round(self):
        """
        Advance round if all battles determined
        """
        if self.curr_round == BracketTypes.TWO:
            self.curr_round = BracketTypes.ONE
            self.save()
            return

        past_round = Round.objects.get(round_num=self.curr_round, game=self) 
        past_round_winners = Battle.objects.filter(round=past_round).exclude(winner=None).values_list('winner', flat=True)

        self.curr_round = self.curr_round//2
        curr_round = Round.objects.create(game=self, round_num=self.curr_round)
        curr_round.entries.set(past_round_winners)
        curr_round.generate_battles()
        self.curr_battle = 0
        self.save()

    def generate_battles_current_round(self):
        battles = []

        if self.curr_round != BracketTypes.ONE:
            curr_round = Round.objects.get(game=self, round_num = self.curr_round)
            battles = Battle.objects.filter(round=curr_round, winner=None)

        return battles

class Round(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    round_num = models.IntegerField(choices=BracketTypes.choices())
    entries = models.ManyToManyField(TournamentEntry)

    def generate_battles(self):
        """
        Generate set of battles each round change
        """
        pairs = []
        options = list(self.entries.all())
        random.shuffle(options)

        for i in range(0, len(options), 2):
            battle = Battle.objects.create(round=self)
            battle.entries.set(options[i: i + 2])

class Battle(models.Model):
    round = models.ForeignKey(Round, on_delete=models.CASCADE)
    entries = models.ManyToManyField(TournamentEntry)
    winner = models.ForeignKey(TournamentEntry, on_delete=models.CASCADE, related_name="wins", null=True, blank=True)

@receiver(post_save, sender=Battle)
def advance_game(sender, instance, created, **kwargs):
    if instance.winner:
        instance.round.game.curr_battle += 1
        if instance.round.round_num == BracketTypes.TWO:
            instance.round.game.winner = instance.winner

        instance.round.game.save()

@receiver(post_save, sender=Game)
def assign_entities(sender, instance, created, **kwargs):
    if created:
        entries = list(TournamentEntry.objects.filter(tournament=instance.tournament).values_list('id', flat=True))
        random_entries = random.sample(entries, instance.bracket_size)
        selected_entries = TournamentEntry.objects.filter(id__in=random_entries)
        start_round = Round.objects.create(game=instance, round_num=instance.bracket_size)
        start_round.entries.set(selected_entries)
        start_round.generate_battles()