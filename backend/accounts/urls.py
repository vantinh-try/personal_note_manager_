from django.urls import path
from .views import AvatarUpdateAPIView, RegisterView, LoginView, LogoutView, ProfileView, ChangePasswordView, DashboardView, VerifyTokenView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('verify-token/', VerifyTokenView.as_view(), name='verify_token'),
    path('avatar/', AvatarUpdateAPIView.as_view(), name='update_avatar'),
]
