from rest_framework import serializers
from .models import Task, TaskCategory

class TaskCategorySerializer(serializers.ModelSerializer):
  class Meta:
    model = TaskCategory
    fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):
  class Meta:
    model = Task
    fields = '__all__'