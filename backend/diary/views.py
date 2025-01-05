
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import DiaryEntry
from .serializers import DiarySerializer

class DiaryViewSet(viewsets.ModelViewSet):
  queryset = DiaryEntry.objects.all()
  serializer_class = DiarySerializer
  permission_classes = [IsAuthenticated]
  filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
  filterset_fields = ['date']
  ordering_fields = ['date']
  
  def get_queryset(self):
    return self.queryset.filter(user=self.request.user)
  
  #* Start session on login
  def perform_create(self, serializer):
    serializer.save(user=self.request.user)