from rest_framework import serializers
from tournament.models import User
from django.contrib.auth import authenticate

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError('Passwords dont match.')
        return data

    def create(self, validated_data):
        del validated_data['confirm_password']
        user = User.objects.create_user(**validated_data)
        return user

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'confirm_password')

class LoginSerializer(serializers.ModelSerializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(**data)
        if user:
            return user
        raise serializers.ValidationError("Incorrect Credentials")

    class Meta:
        model = User
        fields = ('username', 'password')