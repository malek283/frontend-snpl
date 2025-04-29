# yourapp/authentication.py


from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken as JWT_RefreshToken, AccessToken
import jwt

from users.models import User


class JWTBearerAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return None
        
        access_token = auth_header.split(' ')[1]
        
        try:
            payload = AccessToken(access_token)
            user_id = payload['user_id']
            
            try:
                user = User.objects.get(id=user_id, is_active=True)
            except User.DoesNotExist:
                raise AuthenticationFailed('User not found or inactive')
                
            return (user, access_token)
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Access token expired')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid access token')
        
    def authenticate_header(self, request):
        return 'Bearer'
    
    @staticmethod
    def generate_tokens_for_user(user):
        """
        Generate access and refresh tokens for a given user without saving refresh token to the database.
        Returns a tuple of (access_token, refresh_token).
        """
        refresh = JWT_RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)
        
        return access_token, refresh_token