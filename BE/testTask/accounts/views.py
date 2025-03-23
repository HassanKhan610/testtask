from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from .serializers import UserSerializer, UserDetailSerializer
from .models import CustomUser
from rest_framework.permissions import AllowAny

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['username'] = self.user.username
        data['email'] = self.user.email
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class CustomTokenRefreshView(TokenRefreshView):
    pass

class UserRegistrationView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDetailView(APIView):
    def get(self, request):
        user = request.user
        serializer = UserDetailSerializer(user)
        return Response(serializer.data)

class ForgotPasswordView(APIView):
    def post(self, request):
        email = request.data.get('email')
        user = CustomUser.objects.filter(email=email).first()
        if not user:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        token_generator = PasswordResetTokenGenerator()
        token = token_generator.make_token(user)
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        
        current_site = get_current_site(request)
        mail_subject = 'Reset your password'
        message = render_to_string('reset_password_email.html', {
            'user': user,
            'domain': current_site.domain,
            'uid': uidb64,
            'token': token,
        })
        email_message = EmailMessage(
            mail_subject, message, to=[email]
        )
        email_message.send()
        
        return Response({'message': 'Email sent successfully'}, status=status.HTTP_200_OK)

class ResetPasswordView(APIView):
    def post(self, request):
        uidb64 = request.data.get('uidb64')
        token = request.data.get('token')
        new_password = request.data.get('new_password')
        
        try:
            uid = urlsafe_base64_decode(uidb64)
            user = CustomUser.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
            user = None
        
        if user is not None and PasswordResetTokenGenerator().check_token(user, token):
            user.set_password(new_password)
            user.save()
            return Response({'message': 'Password reset successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)