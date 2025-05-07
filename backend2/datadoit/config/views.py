from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import RemiseType
from .serializers import RemiseTypeSerializer
from boutique.models import Boutique

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def remise_type_list_create(request):
    try:
        # Get the associated boutique
        boutique_id = None
        if hasattr(request.user, 'boutique'):
            boutique_id = request.user.boutique.id
        elif hasattr(request.user, 'marchand') and hasattr(request.user.marchand, 'boutique'):
            boutique_id = request.user.marchand.boutique.id
        else:
            boutique_id = request.query_params.get('boutique_id') or request.data.get('boutique')
        
        if not boutique_id:
            return Response(
                {'error': 'No boutique specified and user is not associated with any boutique'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            boutique = Boutique.objects.get(id=boutique_id)
            # Check if user has permission for this boutique
            if hasattr(request.user, 'marchand') and boutique.marchand != request.user.marchand:
                return Response(
                    {'error': 'You do not have permission for this boutique'},
                    status=status.HTTP_403_FORBIDDEN
                )
        except Boutique.DoesNotExist:
            return Response(
                {'error': 'Boutique not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        if request.method == 'GET':
            remise_types = RemiseType.objects.filter(boutique=boutique)
            serializer = RemiseTypeSerializer(remise_types, many=True)
            return Response(serializer.data)
        
        elif request.method == 'POST':
            data = request.data.copy()
            data['boutique'] = boutique_id
            serializer = RemiseTypeSerializer(data=data)
            if serializer.is_valid():
                remise_type = serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def remise_type_detail(request, pk):
    try:
        remise_type = RemiseType.objects.get(pk=pk)
        
        # Get boutique from request or user
        boutique_id = request.data.get('boutique') or request.query_params.get('boutique_id')
        user_boutique = None
        
        # Case 1: User is a boutique
        if hasattr(request.user, 'boutique'):
            user_boutique = request.user.boutique
        # Case 2: User is a marchand with a boutique
        elif hasattr(request.user, 'marchand') and hasattr(request.user.marchand, 'boutique'):
            user_boutique = request.user.marchand.boutique
        # Case 3: Use provided boutique_id
        elif boutique_id:
            try:
                user_boutique = Boutique.objects.get(id=boutique_id)
            except Boutique.DoesNotExist:
                return Response(
                    {'error': 'Specified boutique not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        if not user_boutique:
            return Response(
                {'error': 'User is not associated with any boutique and no valid boutique ID provided'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Allow null boutique during transition period, but ensure permission
        if remise_type.boutique and remise_type.boutique != user_boutique:
            return Response(
                {'error': 'You do not have permission for this remise type'},
                status=status.HTTP_403_FORBIDDEN
            )

        if request.method == 'GET':
            serializer = RemiseTypeSerializer(remise_type)
            return Response(serializer.data)
        
        elif request.method == 'PUT':
            # Prevent modifying boutique
            data = request.data.copy()
            if 'boutique' in data:
                del data['boutique']
                
            serializer = RemiseTypeSerializer(remise_type, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        elif request.method == 'DELETE':
            remise_type.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
            
    except RemiseType.DoesNotExist:
        return Response(
            {'error': 'Remise type not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )