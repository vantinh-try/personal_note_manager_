
from rest_framework.routers import DefaultRouter
from .views import DiaryViewSet

router = DefaultRouter()
router.register('', DiaryViewSet, basename='diary')

urlpatterns = router.urls