from rest_framework import serializers
from tournament.models import Tournament, Game, Battle, TournamentEntry
from django.contrib.sessions.models import Session
from taggit_serializer.serializers import (TagListSerializerField,
                                           TaggitSerializer)

class TournamentSimpleSerializer(serializers.ModelSerializer):
    tags = TagListSerializerField(required=False)

    class Meta:
        model = Tournament
        fields = ('id', 'avatar', 'title', 'description', 'privacy', 'tags', 'url', 'is_nsfw', 'creator', 'created_at', 'updated_at')

class TournamentSerializer(TaggitSerializer, serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, allow_null=True, allow_blank=True)
    entries = serializers.SerializerMethodField('_get_entries')
    tags = TagListSerializerField(required=False)

    def _get_entries(self, obj):
        entries = TournamentEntry.objects.filter(tournament=obj)
        return TournamentEntrySerializer(entries, many=True).data

    class Meta:
        model = Tournament
        fields = '__all__'

class GameSerializer(serializers.ModelSerializer):
    battles = serializers.SerializerMethodField('_get_battles')
    winner = serializers.SerializerMethodField('_get_winner')

    def _get_battles(self, obj):
        battles = obj.current_battles()
        return BattleSerializer(battles, many=True).data

    def _get_winner(self, obj):
        if not obj.winner:
            return None
        return TournamentEntrySerializer(obj.winner).data

    class Meta:
        model = Game
        fields = ('id', 'bracket_size', 'game_size', 'tournament', 'winner', 'battles')

class TournamentEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = TournamentEntry
        fields = '__all__'

class BattleSerializer(serializers.ModelSerializer):
    entries = serializers.SerializerMethodField('_get_entries')

    def _get_entries(self, obj):
        entries = obj.entries.all()
        return TournamentEntrySerializer(entries, many=True).data

    class Meta:
        model = Battle
        fields = ('id', 'entries', 'winner', 'battle_index')