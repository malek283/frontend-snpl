from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Boutique, CategoryBoutique, CategoryProduit, Produit
from .serializers import BoutiqueSerializer, CategoryBoutiqueSerializer, CategoryProduitSerializer, ProduitSerializer


# Boutique CRUD
@api_view(['GET', 'POST'])
def boutique_list_create(request):
    if request.method == 'GET':
        boutiques = Boutique.objects.all()
        serializer = BoutiqueSerializer(boutiques, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = BoutiqueSerializer(data=request.data)
        if serializer.is_valid():
            boutique = serializer.save()  # Boutique créée

            # Maintenant on modifie le marchand lié
            if boutique.marchand:  # Vérification si marchand existe
                marchand = boutique.marchand
                marchand.boutique_nom = boutique.nom
                marchand.description = boutique.description
                marchand.save()

            return Response(BoutiqueSerializer(boutique).data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def boutique_retrieve_update_destroy(request, pk):
    boutique = get_object_or_404(Boutique, pk=pk)

    if request.method == 'GET':
        serializer = BoutiqueSerializer(boutique)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = BoutiqueSerializer(boutique, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        boutique.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# Produit CRUD
@api_view(['GET', 'POST'])
def produit_list_create(request):
    if request.method == 'GET':
        produits = Produit.objects.all()
        serializer = ProduitSerializer(produits, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = ProduitSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def produit_detail(request, pk):
    produit = get_object_or_404(Produit, pk=pk)

    if request.method == 'GET':
        serializer = ProduitSerializer(produit)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = ProduitSerializer(produit, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        produit.delete@api_view(['GET', 'POST'])
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


# CRUD CategoryProduit

# Liste et création des catégories de produit
@api_view(['GET', 'POST'])
def category_produit_list_create(request):
    if request.method == 'GET':
        categories_produit = CategoryProduit.objects.all()
        serializer = CategoryProduitSerializer(categories_produit, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = CategoryProduitSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Détails, mise à jour et suppression de la catégorie de produit
@api_view(['GET', 'PUT', 'DELETE'])
def category_produit_detail(request, pk):
    category_produit = get_object_or_404(CategoryProduit, pk=pk)

    if request.method == 'GET':
        serializer = CategoryProduitSerializer(category_produit)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = CategoryProduitSerializer(category_produit, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        category_produit.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)()
        return Response(status=status.HTTP_204_NO_CONTENT)
