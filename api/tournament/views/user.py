from tournament.models import User, Tournament
from tournament.serializers import TournamentSerializer, UserSerializer, RegisterSerializer, LoginSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status, generics
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
import requests

class TwitchOAuthView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        client_id, client_secret = settings.TWITCH_CLIENTID, settings.TWITCH_CLIENTSECRET
        access_token = request.data.get('access_token')

        oauth_validate_link = 'https://id.twitch.tv/oauth2/validate'
        get_user_link = 'https://api.twitch.tv/kraken/user'

        try:
            validate_json = requests.get(oauth_validate_link, headers={'Authorization': f'OAuth {access_token}'}).json()
        except:
            return Response({"error": "Invalid authentication credentials."}, status=status.HTTP_404_NOT_FOUND)

        try:
            user_json = requests.get(get_user_link, 
                headers={
                    'Authorization': f'OAuth {access_token}', 
                    'Client-ID': client_id,
                    'Accept': 'application/vnd.twitchtv.v5+json'
                }
            ).json()
        except:
            return Response({'error': 'Invalid user'}, status=status.HTTP_404_NOT_FOUND)
  
        email = user_json['email']
        username = user_json['display_name']

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            user = User.objects.create_user(username = username, email=email)
    
        serializer = UserSerializer(user)

        token = RefreshToken.for_user(user)
        token["user"] = serializer.data
        refresh, access = token, token.access_token

        response = Response(str(access), status=status.HTTP_200_OK)
        response.set_cookie('refresh', str(refresh), httponly=True)
        return response

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data

        serializer = UserSerializer(user)

        token = RefreshToken.for_user(user)
        token["user"] = serializer.data
        refresh, access = token, token.access_token

        response = Response(str(access), status=status.HTTP_200_OK)
        response.set_cookie('refresh', str(refresh), httponly=True)
        return response

class UserListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs) -> Response:
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs) -> Response:

        if not request.data:
            return Response({"error": "No data found"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = RegisterSerializer(data = request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            token = RefreshToken.for_user(user)
            token["user"] = serializer.data
            refresh, access = token, token.access_token

            response = Response(str(access), status=status.HTTP_200_OK)
            response.set_cookie('refresh', str(refresh), httponly=True)
            return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserTournamentsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs) -> Response:
        print('hello')
        username = kwargs['username']
        user = User.objects.get(username=username)
        tournaments = Tournament.objects.filter(creator=user)
        serializer = TournamentSerializer(tournaments, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

class UserView(APIView):

    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_user(self, username: str) -> User:
        user = get_object_or_404(User, username=username)
        return user

    def get(self, request, *args, **kwargs) -> Response:
        user = self.get_user(kwargs['username'])
        serializer = UserSerializer(user)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, *args, **kwargs) -> Response:
        pass

    def delete(self, request, *args, **kwargs) -> Response:
        pass