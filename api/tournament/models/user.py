from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class UserManager(BaseUserManager):

    def create_user(self, username: str, email: str, password=None, is_admin=False, **kwargs):
        email = self.normalize_email(email)
        user = self.model(email = email, username = username, admin = is_admin, is_active=True)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_admin(self, username: str, email: str, password=None, is_admin=True, **kwargs):
        return self.create_user(username, email, password, True)

class User(AbstractBaseUser):
    username = models.CharField(max_length=20, unique=True)
    email = models.CharField(max_length=255, unique=True)
    admin = models.BooleanField(default=False)
    is_active = models.BooleanField()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self) -> str:
        return f"{self.username}"