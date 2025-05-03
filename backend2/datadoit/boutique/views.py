import logging
import os
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from users.models import Marchand
from .models import Boutique, CategoryBoutique, CategoryProduit, Produit
from .serializers import BoutiqueSerializer, CategoryBoutiqueSerializer, CategoryProduitSerializer, ProduitSerializer

logger = logging.getLogger(__name__)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def boutique_list_createchat(request):
    if request.method == 'GET':
        boutique_id = request.query_params.get('boutique_id')
        marchand = request.query_params.get('marchand')
        
        try:
            if boutique_id:
                # Pour un client qui cherche une boutique spécifique
                boutique = Boutique.objects.get(id=boutique_id)
                if request.user.role.lower() == 'client':
                    serializer = BoutiqueSerializer(boutique, context={'request': request})
                    return Response(serializer.data)
                elif request.user.role.lower() == 'marchand' and boutique.marchand.user == request.user:
                    serializer = BoutiqueSerializer(boutique, context={'request': request})
                    return Response(serializer.data)
                else:
                    return Response({'error': 'Accès non autorisé'}, status=403)
            elif marchand:
                # Pour un marchand qui cherche ses boutiques
                if request.user.role.lower() == 'marchand':
                    boutiques = Boutique.objects.filter(marchand__user=request.user)
                    serializer = BoutiqueSerializer(boutiques, many=True, context={'request': request})
                    return Response(serializer.data)
                else:
                    return Response({'error': 'Accès non autorisé'}, status=403)
            else:
                # Pour un marchand qui cherche toutes ses boutiques
                if request.user.role.lower() == 'marchand':
                    boutiques = Boutique.objects.filter(marchand__user=request.user)
                    serializer = BoutiqueSerializer(boutiques, many=True, context={'request': request})
                    return Response(serializer.data)
                else:
                    return Response({'error': 'Accès non autorisé'}, status=403)
        except Boutique.DoesNotExist:
            return Response({'error': 'Boutique non trouvée'}, status=404)
        except Exception as e:
            logger.error(f"Erreur lors de la récupération des boutiques: {str(e)}")
            return Response({'error': 'Une erreur est survenue'}, status=500)
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def boutique_list_create(request):
    if request.method == 'GET':
        marchand = request.query_params.get('marchand')
        if marchand:
            boutiques = Boutique.objects.filter(marchand__id=marchand, marchand__user=request.user)
        else:
            boutiques = Boutique.objects.filter(marchand__user=request.user)
        serializer = BoutiqueSerializer(boutiques, many=True, context={'request': request})
        response = Response(serializer.data)
        response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        return response

    elif request.method == 'POST':
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

        logger.debug(f"POST request.data: {request.data}, request.FILES: {request.FILES}")

        serializer = BoutiqueSerializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            boutique = serializer.save(marchand=marchand)
            logger.debug(f"Created Boutique: {boutique.nom}, logo: {boutique.logo}, image: {boutique.image}")
            response = Response(
                BoutiqueSerializer(boutique, context={'request': request}).data,
                status=status.HTTP_201_CREATED
            )
            response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
            return response

        logger.error(f"Serializer errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def boutique_retrieve_update_destroy(request, pk):
    boutique = get_object_or_404(Boutique, pk=pk)

    if request.method == 'GET':
        serializer = BoutiqueSerializer(boutique, context={'request': request})
        response = Response(serializer.data)
        response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        return response

    elif request.method == 'PUT':
        if boutique.marchand.user != request.user:
            return Response(
                {'error': 'You do not own this boutique'},
                status=status.HTTP_403_FORBIDDEN
            )
        data = request.data.copy()
        if 'logo' in request.FILES:
            data['logo_file'] = request.FILES['logo']
            logger.debug(f"Assigned logo_file for PUT: {data['logo_file']}")
        if 'image' in request.FILES:
            data['image_file'] = request.FILES['image']
            logger.debug(f"Assigned image_file for PUT: {data['image_file']}")
        serializer = BoutiqueSerializer(boutique, data=data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            response = Response(serializer.data)
            response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
            return response
        logger.error(f"Serializer errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        if boutique.marchand.user != request.user:
            return Response(
                {'error': 'You do not own this boutique'},
                status=status.HTTP_403_FORBIDDEN
            )
        boutique.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def produit_list_create(request):
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
        category_produit_id = request.query_params.get('category_produit_id')
        if category_produit_id:
            produits = Produit.objects.filter(
                category_produit_id=category_produit_id,
                boutique__marchand=marchand
            )
        else:
            produits = Produit.objects.filter(boutique__marchand=marchand)
        serializer = ProduitSerializer(produits, many=True, context={'request': request})
        response = Response(serializer.data)
        response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        return response

    elif request.method == 'POST':
        data = request.data.copy()
        logger.debug(f"POST request.data: {request.data}, request.FILES: {request.FILES}")
        if 'image' in request.FILES:
            data['image_file'] = request.FILES['image']
            logger.debug(f"Assigned image_file: {data['image_file']}")
        serializer = ProduitSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            produit = serializer.save()
            logger.debug(f"Created Produit: {produit.nom}, image: {produit.image}")
            response = Response(ProduitSerializer(produit, context={'request': request}).data, status=status.HTTP_201_CREATED)
            response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
            return response
        logger.error(f"Serializer errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def produit_detail(request, pk):
    produit = get_object_or_404(Produit, pk=pk)

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

    if produit.boutique.marchand != marchand:
        return Response(
            {'error': 'You do not own this product'},
            status=status.HTTP_403_FORBIDDEN
        )

    if request.method == 'GET':
        serializer = ProduitSerializer(produit, context={'request': request})
        response = Response(serializer.data)
        response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        return response

    elif request.method == 'PUT':
        data = request.data.copy()
        if 'image' in request.FILES:
            data['image_file'] = request.FILES['image']
            logger.debug(f"Assigned image_file for PUT: {data['image_file']}")
        serializer = ProduitSerializer(
            produit,
            data=data,
            partial=True,
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            response = Response(serializer.data)
            response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
            return response
        logger.error(f"Serializer errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        produit.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
def category_boutique_list_create(request):
    if request.method == 'GET':
        categories_boutique = CategoryBoutique.objects.all()
        serializer = CategoryBoutiqueSerializer(categories_boutique, many=True, context={'request': request})
        response_data = serializer.data
        logger.debug(f"GET CategoryBoutique response data: {response_data}")
        # Log database state for each category
        for category in categories_boutique:
            image_path = category.image.path if category.image else None
            logger.debug(f"CategoryBoutique {category.nom} (id: {category.id}): image={category.image}, file_exists={os.path.exists(image_path) if image_path else False}")
        response = Response(response_data)
        response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        return response

    elif request.method == 'POST':
        data = request.data.copy()
        logger.debug(f"POST request.data: {request.data}, request.FILES: {request.FILES}")
        if 'image' in request.FILES:
            data['image_file'] = request.FILES['image']
            logger.debug(f"Assigned image_file: {data['image_file']}")
        serializer = CategoryBoutiqueSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            category_boutique = serializer.save()
            response_data = CategoryBoutiqueSerializer(category_boutique, context={'request': request}).data
            logger.debug(f"Created CategoryBoutique: {category_boutique.nom}, image: {category_boutique.image}, response: {response_data}")
            response = Response(response_data, status=status.HTTP_201_CREATED)
            response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
            return response
        logger.error(f"Serializer errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def category_boutique_detail(request, pk):
    category_boutique = get_object_or_404(CategoryBoutique, pk=pk)

    if request.method == 'GET':
        serializer = CategoryBoutiqueSerializer(category_boutique, context={'request': request})
        logger.debug(f"GET CategoryBoutique (id: {pk}) response data: {serializer.data}")
        image_path = category_boutique.image.path if category_boutique.image else None
        logger.debug(f"CategoryBoutique {category_boutique.nom} (id: {pk}): image={category_boutique.image}, file_exists={os.path.exists(image_path) if image_path else False}")
        response = Response(serializer.data)
        response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        return response

    elif request.method == 'PUT':
        data = request.data.copy()
        if 'image' in request.FILES:
            data['image_file'] = request.FILES['image']
            logger.debug(f"Assigned image_file for PUT: {data['image_file']}")
        serializer = CategoryBoutiqueSerializer(category_boutique, data=data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            response_data = CategoryBoutiqueSerializer(category_boutique, context={'request': request}).data
            logger.debug(f"Updated CategoryBoutique: {category_boutique.nom}, response: {response_data}")
            response = Response(response_data)
            response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
            return response
        logger.error(f"Serializer errors: {serializer.errors}")
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
        serializer = CategoryProduitSerializer(categories_produit, many=True, context={'request': request})
        logger.debug(f"GET CategoryProduit response data: {serializer.data}")
        response = Response(serializer.data)
        response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        return response

    elif request.method == 'POST':
        data = request.data.copy()
        logger.debug(f"POST request.data: {request.data}, request.FILES: {request.FILES}")
        if 'image' in request.FILES:
            data['image_file'] = request.FILES['image']
            logger.debug(f"Assigned image_file: {data['image_file']}")
        serializer = CategoryProduitSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            category_produit = serializer.save()
            response_data = CategoryProduitSerializer(category_produit, context={'request': request}).data
            logger.debug(f"Created CategoryProduit: {category_produit.nom}, image: {category_produit.image}, response: {response_data}")
            response = Response(response_data, status=status.HTTP_201_CREATED)
            response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
            return response
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
        serializer = CategoryProduitSerializer(category_produit, context={'request': request})
        logger.debug(f"GET CategoryProduit (id: {pk}) response data: {serializer.data}")
        response = Response(serializer.data)
        response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        return response

    elif request.method == 'PUT':
        data = request.data.copy()
        if 'image' in request.FILES:
            data['image_file'] = request.FILES['image']
            logger.debug(f"Assigned image_file for PUT: {data['image_file']}")
        serializer = CategoryProduitSerializer(
            category_produit,
            data=data,
            partial=True,
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            response_data = CategoryProduitSerializer(category_produit, context={'request': request}).data
            logger.debug(f"Updated CategoryProduit: {category_produit.nom}, response: {response_data}")
            response = Response(response_data)
            response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
            return response
        logger.error(f"Serializer errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        category_produit.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)