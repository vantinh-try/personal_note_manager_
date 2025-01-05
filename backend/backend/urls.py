from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('api/tasks/', include('tasks.urls')),
    path('api/notes/', include('notes.urls')),
    path('api/diary/', include('diary.urls')),
    path('api/calendar/', include('calendar_app.urls')),
]
