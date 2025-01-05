
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
  queryset = Task.objects.all()
  serializer_class = TaskSerializer
  permission_classes = [IsAuthenticated]
  
  def get_queryset(self):
    return self.queryset.filter(user=self.request.user)
  
  def perform_create(self, serializer):
    serializer.save(user=self.request.user)