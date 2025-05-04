from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Badges, UserBadge
from .serializers import BadgesSerializer, UserBadgeSerializer

# GET et POST pour les badges
@api_view(['GET', 'POST'])
def badges_list_create_view(request):
    if request.method == 'GET':
        badges = Badges.objects.all()
        serializer = BadgesSerializer(badges, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = BadgesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# GET des badges attribués à l'utilisateur connecté
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_badges_view(request):
    user_badges = UserBadge.objects.filter(user=request.user)
    serializer = UserBadgeSerializer(user_badges, many=True)
    return Response(serializer.data)
