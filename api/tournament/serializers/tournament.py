from rest_framework import serializers
from tournament.models import Tournament, Game, Battle, TournamentEntry
from django.contrib.sessions.models import Session

class TournamentSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, allow_null=True, allow_blank=True)
    entries = serializers.SerializerMethodField('_get_entries')

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
        battles = obj.generate_battles_current_round()
        return BattleSerializer(battles, many=True).data

    def _get_winner(self, obj):
        if not obj.winner:
            return None
        return TournamentEntrySerializer(obj.winner).data

    class Meta:
        model = Game
        fields = ('id', 'bracket_size', 'tournament', 'winner', 'battles')

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
        fields = ('id', 'entries', 'winner')