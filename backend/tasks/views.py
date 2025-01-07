
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Task
from .serializers import TaskSerializer


class TaskListCreateAPIView(APIView):
  permission_classes = [IsAuthenticated]
  
  def get(self, request):
    tasks = Task.objects.filter(user=request.user)
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
  
  def post(self, request):
    serializer = TaskSerializer(data=request.data)
    if serializer.is_valid():
      serializer.save(user=request.user)
      return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TaskDetailAPIView(APIView):
  permission_classes = [IsAuthenticated]
  
  def get_object(self, pk, user):
    try:
      return Task.objects.get(pk=pk, user=user)
    except Task.DoesNotExist:
      return None
  
  def get(self, request, pk):
    task = self.get_object(pk, request.user)
    if not task:
      return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = TaskSerializer(task)
    return Response(serializer.data, status=status.HTTP_200_OK)
  
  def put(self, request, pk):
    task = self.get_object(pk, request.user)
    if not task:
      return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = TaskSerializer(task, data=request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
  
  def delete(self, request, pk):
    task = self.get_object(pk, request.user)
    if not task:
      return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
    task.delete()
    return Response({"detail": "Deleted successfully."}, status=status.HTTP_204_NO_CONTENT)