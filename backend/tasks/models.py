from django.db import models
from django.contrib.auth import get_user_model


User = get_user_model()

class TaskCategory(models.Model):
  user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='categories')
  name = models.CharField(max_length=255)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
  
  def __str__(self):
    return self.name

class Task(models.Model):
  STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('completed', 'Completed'),
  ]
  
  user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
  category = models.ForeignKey(TaskCategory, on_delete=models.CASCADE, related_name='tasks', null=True, blank=True)
  title = models.CharField(max_length=255)
  description = models.TextField(blank=True, null=True)
  due_date = models.DateTimeField(blank=True, null=True)
  status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
  
  def __str__(self):
    return self.title
  