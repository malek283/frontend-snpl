import logging
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from users.models import Marchand
from .models import Boutique, CategoryBoutique, CategoryProduit, Produit
from .serializers import BoutiqueSerializer, CategoryBoutiqueSerializer, CategoryProduitSerializer, ProduitSerializer

logger = logging.getLogger(__name__)


from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Boutique
from .serializers import BoutiqueSerializer

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def boutique_list_create(request):
    if request.method == 'GET':
        # Filter boutiques by marchand_id if provided
        marchand = request.query_params.get('marchand')
        if marchand:
            # Filter by the provided marchand ID (assuming it's a valid ID)
            boutiques = Boutique.objects.filter(marchand__id=marchand, marchand__user=request.user)
        else:
            # Filter by the authenticated user's boutiques
            boutiques = Boutique.objects.filter(marchand__user=request.user)
        serializer = BoutiqueSerializer(boutiques, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        # Ensure the user has a Marchand profile
        try:
            marchand = Marchand.objects.get(user=request.user)
            if not marchand.is_marchant:
                return Response(
                    {'error': 'User is not a merchant'},
                    status=status.HTTP_403_FORBIDDEN
                )
        except Marchand.DoesNotExist:
            return Response(
                {'error': 'Merchant profile not found'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Handle file upload and create boutique
        data = request.data.copy()
        data['image'] = request.FILES.get('image')
        data['logo'] = request.FILES.get('logo')
        serializer = BoutiqueSerializer(data=data, context={'request': request})
    if serializer.is_valid():
        boutique = serializer.save(marchand=marchand)  # <= injecte le marchand ici
        return Response(BoutiqueSerializer(boutique, context={'request': request}).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def boutique_retrieve_update_destroy(request, pk):
    boutique = get_object_or_404(Boutique, pk=pk)

    if request.method == 'GET':
        serializer = BoutiqueSerializer(boutique)
        return Response(serializer.data)

    elif request.method == 'PUT':
        # Check if the user is the boutique's merchant
        if boutique.marchand.user != request.user:
            return Response(
                {'error': 'You do not own this boutique'},
                status=status.HTTP_403_FORBIDDEN
            )
        # Handle file upload and update boutique
        data = request.data.copy()
        if request.FILES.get('image'):
            data['image'] = request.FILES.get('image')
        serializer = BoutiqueSerializer(boutique, data=data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        # Check if the user is the boutique's merchant
        if boutique.marchand.user != request.user:
            return Response(
                {'error': 'You do not own this boutique'},
                status=status.HTTP_403_FORBIDDEN
            )
        boutique.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# Produit CRUD
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def produit_list_create(request):
    try:
        # Ensure the user has a Marchand profile
        marchand = Marchand.objects.get(user=request.user)
        if not marchand.is_marchant:
            return Response(
                {'error': 'User is not a merchant'},
                status=status.HTTP_403_FORBIDDEN
            )
    except Marchand.DoesNotExist:
        return Response(
            {'error': 'Merchant profile not found'},
            status=status.HTTP_403_FORBIDDEN
        )

    if request.method == 'GET':
        # Filter products by category_produit_id and merchant's boutiques
        category_produit_id = request.query_params.get('category_produit_id')
        if category_produit_id:
            produits = Produit.objects.filter(
                category_produit_id=category_produit_id,
                boutique__marchand=marchand
            )
        else:
            produits = Produit.objects.filter(boutique__marchand=marchand)
        serializer = ProduitSerializer(produits, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        # Handle file upload and create product
        data = request.data.copy()
        data['image'] = request.FILES.get('image')
        serializer = ProduitSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            produit = serializer.save()
            return Response(ProduitSerializer(produit).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def produit_detail(request, pk):
    produit = get_object_or_404(Produit, pk=pk)

    try:
        # Ensure the user has a Marchand profile
        marchand = Marchand.objects.get(user=request.user)
        if not marchand.is_marchant:
            return Response(
                {'error': 'User is not a merchant'},
                status=status.HTTP_403_FORBIDDEN
            )
    except Marchand.DoesNotExist:
        return Response(
            {'error': 'Merchant profile not found'},
            status=status.HTTP_403_FORBIDDEN
        )

    # Check if the product belongs to the merchant's boutique
    if produit.boutique.marchand != marchand:
        return Response(
            {'error': 'You do not own this product'},
            status=status.HTTP_403_FORBIDDEN
        )

    if request.method == 'GET':
        serializer = ProduitSerializer(produit)
        return Response(serializer.data)

    elif request.method == 'PUT':
        # Handle file upload and update product
        data = request.data.copy()
        if request.FILES.get('image'):
            data['image'] = request.FILES.get('image')
        serializer = ProduitSerializer(
            produit,
            data=data,
            partial=True,
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        produit.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
@api_view(['GET', 'POST'])
 # Force l'utilisation de JSON
def category_boutique_list_create(request):
    if request.method == 'GET':
        categories_boutique = CategoryBoutique.objects.all()
        serializer = CategoryBoutiqueSerializer(categories_boutique, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = CategoryBoutiqueSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Détails, mise à jour et suppression de la catégorie de boutique
@api_view(['GET', 'PUT', 'DELETE'])
def category_boutique_detail(request, pk):
    category_boutique = get_object_or_404(CategoryBoutique, pk=pk)

    if request.method == 'GET':
        serializer = CategoryBoutiqueSerializer(category_boutique)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = CategoryBoutiqueSerializer(category_boutique, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        category_boutique.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def category_produit_list_create(request):
    try:
        marchand = Marchand.objects.get(user=request.user)
        if not marchand.is_marchant:
            return Response(
                {'error': 'User is not a merchant'},
                status=status.HTTP_403_FORBIDDEN
            )
    except Marchand.DoesNotExist:
        return Response(
            {'error': 'Merchant profile not found'},
            status=status.HTTP_403_FORBIDDEN
        )

    if request.method == 'GET':
        categories_produit = CategoryProduit.objects.filter(boutique__marchand=marchand)
        serializer = CategoryProduitSerializer(categories_produit, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        # Log incoming request data for debugging
        logger.debug(f"request.data: {request.data}")
        logger.debug(f"request.FILES: {request.FILES}")
        logger.debug(f"Content-Type: {request.content_type}")

        # Handle QueryDict or dict
        if isinstance(request.data, dict):
            data = request.data
        else:
            # Convert QueryDict or list-like data to dict
            try:
                data = dict(request.data.lists()) if hasattr(request.data, 'lists') else dict(request.data)
            except (ValueError, TypeError) as e:
                logger.error(f"Failed to convert request.data to dict: {e}")
                return Response(
                    {'error': 'Invalid data format. Expected key-value pairs.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Handle file upload
        if request.FILES.get('image'):
            data['image'] = request.FILES.get('image')

        serializer = CategoryProduitSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            category_produit = serializer.save()
            return Response(
                CategoryProduitSerializer(category_produit).data,
                status=status.HTTP_201_CREATED
            )
        logger.error(f"Serializer errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def category_produit_retrieve_update_destroy(request, pk):
    category_produit = get_object_or_404(CategoryProduit, pk=pk)

    try:
        marchand = Marchand.objects.get(user=request.user)
        if not marchand.is_marchant:
            return Response(
                {'error': 'User is not a merchant'},
                status=status.HTTP_403_FORBIDDEN
            )
    except Marchand.DoesNotExist:
        return Response(
            {'error': 'Merchant profile not found'},
            status=status.HTTP_403_FORBIDDEN
        )

    if category_produit.boutique.marchand != marchand:
        return Response(
            {'error': 'You do not own this category'},
            status=status.HTTP_403_FORBIDDEN
        )

    if request.method == 'GET':
        serializer = CategoryProduitSerializer(category_produit)
        return Response(serializer.data)

    elif request.method == 'PUT':
        data = request.data.copy()
        if request.FILES.get('image'):
            data['image'] = request.FILES.get('image')
        serializer = CategoryProduitSerializer(
            category_produit,
            data=data,
            partial=True,
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        category_produit.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)