from tournament.models import User
from tournament.serializers import UserSerializer, RegisterSerializer, LoginSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status, generics
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data

        token = RefreshToken.for_user(user)
        token["user"] = serializer.data
        refresh, access = token, token.access_token
        tokens = {
            "refresh": str(refresh), 
            "access": str(access)
        }

        return Response(tokens, status=status.HTTP_200_OK)

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
            tokens = {
                "refresh": str(refresh), 
                "access": str(access)
            }

            return Response(tokens, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserView(APIView):

    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_user(self, id: int) -> User:
        user = get_object_or_404(User, pk=id)
        return user

    def get(self, request, *args, **kwargs) -> Response:
        user = self.get_user(kwargs['id'])
        serializer = UserSerializer(user)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, *args, **kwargs) -> Response:
        pass

    def delete(self, request, *args, **kwargs) -> Response:
        pass