from django.urls import path
from .views import UserRegistrationView, UserDetailView, CustomTokenObtainPairView, CustomTokenRefreshView, ForgotPasswordView, ResetPasswordView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('user/', UserDetailView.as_view(), name='user_detail'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('refresh/', CustomTokenRefreshView.as_view(), name='refresh'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot_password'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset_password'),
]