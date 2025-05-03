from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.urls import reverse
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import (
    UserSerializer,
    CustomTokenObtainPairSerializer,
    ChangePasswordSerializer,
    ResetPasswordEmailSerializer
)

User = get_user_model()

class MeView(generics.RetrieveAPIView):
    """
    API endpoint to retrieve the authenticated user's data
    """
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

class RegisterView(generics.CreateAPIView):
    """
    API endpoint for user registration
    """
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom token view to use our serializer
    """
    serializer_class = CustomTokenObtainPairSerializer

class ChangePasswordView(generics.UpdateAPIView):
    """
    API endpoint for changing password
    """
    serializer_class = ChangePasswordSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Check old password
            if not user.check_password(serializer.validated_data.get("old_password")):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)

            # Set new password
            user.set_password(serializer.validated_data.get("new_password"))
            user.save()
            return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResetPasswordEmailView(APIView):
    """
    API endpoint for sending password reset email
    """
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = ResetPasswordEmailSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data.get('email')
            try:
                user = User.objects.get(email=email)
                # Generate token
                token = default_token_generator.make_token(user)
                uid = urlsafe_base64_encode(force_bytes(user.pk))

                # Build reset URL (frontend should handle this)
                reset_url = f"/reset-password/{uid}/{token}/"

                # Send email
                send_mail(
                    'Password Reset Request',
                    f'Please click the link to reset your password: {reset_url}',
                    'noreply@ecommerce.com',
                    [email],
                    fail_silently=False,
                )
                return Response(
                    {"message": "Password reset email has been sent."},
                    status=status.HTTP_200_OK
                )
            except User.DoesNotExist:
                # Don't reveal that email doesn't exist for security
                pass

        return Response(
            {"message": "Password reset email has been sent if the email exists."},
            status=status.HTTP_200_OK
        )

class ResetPasswordConfirmView(APIView):
    """
    API endpoint for confirming password reset
    """
    permission_classes = (permissions.AllowAny,)

    def post(self, request, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)

            # Verify token
            if default_token_generator.check_token(user, token):
                password = request.data.get('password')

                if not password:
                    return Response(
                        {"error": "Password is required"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                user.set_password(password)
                user.save()
                return Response(
                    {"message": "Password has been reset successfully."},
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {"error": "The reset link is invalid or has expired."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response(
                {"error": "The reset link is invalid or has expired."},
                status=status.HTTP_400_BAD_REQUEST
            )