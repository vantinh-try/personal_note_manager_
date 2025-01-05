
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from tasks.models import Task
from notes.models import Note
from diary.models import DiaryEntry
from datetime import datetime, timedelta

class CalendarView(APIView):
  permission_classes = [IsAuthenticated]
  
  def get(self, request):
    user = request.user
    date_str = request.query_params.get('date')
    view_type = request.query_params.get('view', 'day')  #* Default: day
    
    if not date_str:
      return Response({"error": "Date parameter is required"}, status=400)
    
    #* Day Parsing
    try:
      date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
      return Response({"error": "Invalid date format. Use YYYY-MM-DD"}, status=400)
    
    #* Determine time range
    if view_type == "day":
      start_date = date
      end_date = date + timedelta(days=1)
    elif view_type == "week":
      start_date = date - timedelta(days=date.weekday())
      end_date = start_date + timedelta(days=7)
    elif view_type == "month":
      start_date = date.replace(day=1)
      next_month = (date.replace(day=28) + timedelta(days=4)).replace(day=1)
      end_date = next_month
    else:
      return Response({"error": "Invalid view type. Use 'day', 'week' or 'month'"}, status=400)
    
    tasks = Task.objects.filter(user=user, due_date__range=(start_date, end_date))
    notes = Note.objects.filter(user=user, created_at__date__range=(start_date, end_date))
    diary_entries = DiaryEntry.objects.filter(user=user, date__range=(start_date, end_date))
    
    response_data = {
      "tasks": [{"id": task.id, "title": task.title, "due_date": task.due_date} for task in tasks],
      "notes": [{"id": note.id, "title": note.title, "created_at": note.created_at} for note in notes],
      "diary_entries": [{"id": entry.id, "content": entry.content, "date": entry.date} for entry in diary_entries],
    }
    
    return response_data