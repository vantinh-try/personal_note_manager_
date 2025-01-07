from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
  email = models.EmailField(unique=True)
  avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
  REQUIRED_FIELDS = ['email']

