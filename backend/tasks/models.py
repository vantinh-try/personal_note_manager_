from django.db import models
from django.contrib.auth import get_user_model
from django.utils.timezone import now

User = get_user_model()

class Task(models.Model):
  STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('completed', 'Completed'),
  ]
  
  user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
  title = models.CharField(max_length=255)
  description = models.TextField(blank=True, null=True)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
  
  def __str__(self):
    return self.title
  