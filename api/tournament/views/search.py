from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from tournament.models import Tournament
from tournament.serializers import TournamentSerializer
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
import datetime, json

class SearchTournamentView(APIView):
    permission_classes = [permissions.AllowAny]

    @method_decorator(cache_page(30))
    def get(self, request, *args, **kwargs):
        query = request.query_params['q']
        tournaments = Tournament.objects.search(query)

        if request.query_params.get('tags[]'):
            tags = request.query_params.getlist('tags[]')
            tournaments = tournaments.filter(tags__name__in=tags).distinct()

        if request.query_params.get('date'):
            date_str = request.query_params.get('date')
            datetime_obj = datetime.datetime.strptime(date_str, '%Y-%m-%d')
            tournaments = tournaments.filter(created_at__gte=datetime_obj)

        if request.query_params.get('filter'):
            filter = request.query_params.get('filter')
            tournaments = tournaments.order_by(f'-{filter}')

        serializer = TournamentSerializer(tournaments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)