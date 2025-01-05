
from rest_framework.routers import DefaultRouter
from .views import TaskCategoryViewSet, TaskViewSet

router = DefaultRouter()
router.register('categories', TaskCategoryViewSet, basename='taskcategory')
router.register('tasks', TaskViewSet, basename='task')

urlpatterns = router.urls
