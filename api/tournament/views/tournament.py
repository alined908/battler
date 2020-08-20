from tournament.models import Tournament, Game, Battle, TournamentEntry
from django.contrib.sessions.models import Session
from tournament.serializers import TournamentSerializer, GameSerializer, TournamentEntrySerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.shortcuts import get_object_or_404
from django.views.decorators.cache import cache_page 
from django.utils.decorators import method_decorator

class TournamentListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs) -> Response:
        tournaments = Tournament.objects.all()
        serializer = TournamentSerializer(tournaments, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs) -> Response:
        serializer = TournamentSerializer(data = request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TournamentView(APIView):

    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_tournament(self, hash: str) -> Tournament:
        tournament = get_object_or_404(Tournament, pk=hash)
        return tournament

    # @method_decorator(cache_page(60 * 5))
    def get(self, request, *args, **kwargs) -> Response:
        tournament = self.get_tournament(kwargs['id'])
        serializer = TournamentSerializer(tournament)
        response = Response(serializer.data, status=status.HTTP_200_OK)
        
        return response

    def patch(self, request, *args, **kwargs) -> Response:
        pass

    def delete(self, request, *args, **kwargs) -> Response:
        pass

class TournamentEntryListView(APIView):

    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs) -> Response:
        pass

    def post(self, request, *args, **kwargs) -> Response:
        
        entry_serializer = TournamentEntrySerializer(data=request.data)

        if entry_serializer.is_valid():
            entry_serializer.save()
            return Response(entry_serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(entry_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs) -> Response:

        entry_id = kwargs

class TournamentEntryView(APIView):

    permission_classes = [permissions.AllowAny]

    def get_entry(self, id):
        entry = get_object_or_404(TournamentEntry, id=id)
        return entry

    def patch(self, request, *args, **kwargs) -> Response:
        entry = self.get_entry(kwargs['entry_id'])
        entry.title = request.data['title']
        entry.save()
        
        serializer = TournamentEntrySerializer(entry)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs) -> Response:

        entry = self.get_entry(kwargs['entry_id'])
        entry.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)

class GameView(APIView):

    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs) -> Response:
        if not request.session.exists(request.session.session_key):
            return Response("No session available", status=status.HTTP_400_BAD_REQUEST)

        try:
            game = Game.objects.get(session_id=request.session.session_key, tournament_id=kwargs['id'], is_gameend=False)
            serializer = GameSerializer(game)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Game.DoesNotExist:
            return Response("Game does not exist", status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, *args, **kwargs) -> Response:
        """
        Request - Create new Game
        Response - Send Game object (with all first round battles)
        """
        # Set session_id for this game
        if not request.session.exists(request.session.session_key):
            request.session.create()
        

        game = Game.objects.create(bracket_size=int(request.data['bracket_size']), session_id=request.session.session_key, tournament_id=kwargs['id'])
        serializer = GameSerializer(game)
        response = Response(serializer.data, status=status.HTTP_201_CREATED)
        response.set_cookie('sessionid', request.session.session_key, httponly=True)
        return response

    def patch(self, request, *args, **kwargs) -> Response:
        """
        Request - end_game
        Response - Send 
        """
        game = Game.objects.get(session_id=request.session.session_key, tournament_id=kwargs['id'], is_gameend=False)
        game.is_gameend = True
        game.save()

        return Response("Ended game successfully.", status=status.HTTP_200_OK)

class BattleView(APIView):

    permission_classes = [permissions.AllowAny]

    def patch(self, request, *args, **kwargs):
        
        winner = request.data['winner']
        battle = Battle.objects.get(pk=kwargs['battle_id'])
        battle.winner_id = winner
        battle.save()

        return Response("Successfully saved battle", status=status.HTTP_200_OK)