from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from users.authentication import JWTBearerAuthentication
from users.serializers import LoginSerializer, UserSerializer, SignupSerializer, UserUpdateSerializer
from users.models import User

from rest_framework.permissions import AllowAny, IsAuthenticated
from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from .serializers import LoginSerializer, UserSerializer
from .authentication import JWTBearerAuthentication
from rest_framework.permissions import IsAdminUser

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data, context={'request': request})
    serializer.is_valid(raise_exception=True)
    
    user = serializer.validated_data['user']
    
    # Vérification selon le rôle
    if user.role == 'marchand':
        if not user.is_approved:
            return Response({
                'detail': 'Votre compte marchand n\'est pas encore approuvé.'
            }, status=status.HTTP_403_FORBIDDEN)
    elif user.role == 'client':
        pass  # Pas besoin d'approuver
    elif user.role == 'admin':
        pass  # Si tu veux ajouter des vérifications ou actions spécifiques pour un admin
    else:
        return Response({
            'detail': 'Rôle non autorisé.'
        }, status=status.HTTP_403_FORBIDDEN)

    # Génération des tokens
    access_token, refresh_token = JWTBearerAuthentication.generate_tokens_for_user(user)

    return Response({
        'user': UserSerializer(user).data,
        'access_token': access_token,
        'refresh_token': refresh_token
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])

def signup_view(request):
    serializer = SignupSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    user = serializer.save()
    
    return Response({
        'user': UserSerializer(user).data,
    
    }, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_detail_view(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_list_view(request):
    if request.user.role != 'admin':
        raise PermissionDenied("Only admins can list all users.")
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])

def user_update_view(request, user_id):
    if request.user.role != 'admin':
        raise PermissionDenied("Only admins can update other users.")
    
    user = get_object_or_404(User, id=user_id)
    serializer = UserUpdateSerializer(user, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    updated_user = serializer.save()
    return Response(UserSerializer(updated_user).data, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])

def user_delete_view(request, user_id):
    if request.user.role != 'admin':
        raise PermissionDenied("Only admins can delete other users.")
    
    user = get_object_or_404(User, id=user_id)
    if user.role == 'admin':
        raise PermissionDenied("Cannot delete admin accounts.")
    user.delete()
    return Response({"message": "User deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
@api_view(['POST'])
def approve_user(request, user_id):
    user = get_object_or_404(User, id=user_id)
    
    if user.is_approved:
        return Response({'detail': 'Utilisateur déjà approuvé.'}, status=status.HTTP_400_BAD_REQUEST)
    
    user.is_approved = True
    user.save()
    return Response({'detail': 'Utilisateur approuvé avec succès.'}, status=status.HTTP_200_OK)

@api_view(['POST'])
def refuse_user(request, user_id):
    user = get_object_or_404(User, id=user_id)
    
    if not user.is_approved:
        return Response({'detail': 'Utilisateur déjà refusé ou non approuvé.'}, status=status.HTTP_400_BAD_REQUEST)
    
    user.is_approved = False
    user.save()
    return Response({'detail': 'Utilisateur refusé avec succès.'}, status=status.HTTP_200_OK)