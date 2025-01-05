from django.db import models
from django.contrib.auth import get_user_model


User = get_user_model()

class DiaryEntry(models.Model):
  user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='diary_entries')
  date = models.DateField()
  content = models.TextField()
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
  
  def __str__(self):
    return f"Diary Entry {self.date}"
  