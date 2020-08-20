from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from tournament.models import Tournament
from tournament.serializers import TournamentSimpleSerializer

class SearchTournamentView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        query = request.query_params['q']
        tournaments = Tournament.objects.search(query)
        serializer = TournamentSimpleSerializer(tournaments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)