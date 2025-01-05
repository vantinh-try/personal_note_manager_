from rest_framework import serializers
from .models import DiaryEntry

class DiarySerializer(serializers.ModelSerializer):
  class Meta:
    model = DiaryEntry
    fields = ['id', 'user', 'date', 'content', 'created_at', 'updated_at']
    read_only_fields = ['id', 'user', 'created_at', 'updated_at']