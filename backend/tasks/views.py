
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Task, TaskCategory
from .serializers import TaskSerializer, TaskCategorySerializer

class TaskCategoryViewSet(viewsets.ModelViewSet):
  queryset = TaskCategory.objects.all()
  serializer_class = TaskCategorySerializer
  permission_classes = [IsAuthenticated]
  
  def get_queryset(self):
      return self.queryset.filter(user=self.request.user)

  def perform_create(self, serializer):
      serializer.save(user=self.request.user)

class TaskViewSet(viewsets.ModelViewSet):
  queryset = Task.objects.all()
  serializer_class = TaskSerializer
  permission_classes = [IsAuthenticated]
  filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
  filterset_fields = ['status', 'due_date']
  ordering_fields = ['due_date', 'created_at']
  
  def get_queryset(self):
    return self.queryset.filter(user=self.request.user)
  
  def perform_create(self, serializer):
    serializer.save(user=self.request.user)