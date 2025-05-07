# views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from rewards.models import Badges, UserBadge
from .models import Panier, LignePanier
from .serializers import LignePanierWriteSerializer, PanierSerializer, EchangeSerializer
from boutique.models import Echange, Produit
from users.models import Client

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def panier_view(request):
    try:
        client_profile = request.user.client_profile
    except Client.DoesNotExist:
        return Response(
            {"message": "User is not a client. Cart functionality is only available for clients."},
            status=status.HTTP_403_FORBIDDEN
        )

    panier, created = Panier.objects.get_or_create(client=client_profile)

    if request.method == 'GET':
        serializer = PanierSerializer(panier)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = PanierSerializer(panier, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart_view(request):
    try:
        client_profile = request.user.client_profile
    except Client.DoesNotExist:
        return Response(
            {"message": "User is not a client. Cart functionality is only available for clients."},
            status=status.HTTP_403_FORBIDDEN
        )

    panier, created = Panier.objects.get_or_create(client=client_profile)
    
    produit_id = request.data.get('produit_id')
    if not produit_id:
        return Response(
            {"message": "Product ID is required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        produit = Produit.objects.get(id=produit_id)
    except Produit.DoesNotExist:
        return Response(
            {"message": "Product not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    # Check if product already in cart
    ligne, created = LignePanier.objects.get_or_create(
        panier=panier,
        produit=produit,
        defaults={'quantite': request.data.get('quantite', 1)}
    )

    if not created:
        ligne.quantite += int(request.data.get('quantite', 1))
        ligne.save()

    serializer = LignePanierWriteSerializer(ligne)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def checkout_view(request):
    try:
        client_profile = request.user.client_profile
    except Client.DoesNotExist:
        return Response(
            {"message": "User is not a client. Cart functionality is only available for clients."},
            status=status.HTTP_403_FORBIDDEN
        )

    try:
        panier = Panier.objects.get(client=client_profile)
        if not panier.lignes.exists():
            return Response({"message": "Le panier est vide."}, status=status.HTTP_400_BAD_REQUEST)

        total = sum(ligne.produit.prix * ligne.quantite for ligne in panier.lignes.all())
        boutique = panier.lignes.first().produit.boutique

        # Create order with shipping info
        echange = Echange.objects.create(
            boutique=boutique,
            utilisateur=request.user,
            montant=total,
            shipping_info=request.data.get('shipping_info', {})
        )

        # Check if it's the first purchase
        if Echange.objects.filter(utilisateur=request.user).count() == 1:
            badge = Badges.objects.get(nom="Premier achat")
            UserBadge.objects.get_or_create(user=request.user, badge=badge)

        # Clear the cart
        panier.lignes.all().delete()

        return Response(
            {"message": "Order placed successfully", "order_id": echange.id},
            status=status.HTTP_201_CREATED
        )

    except Panier.DoesNotExist:
        return Response({"message": "Panier non trouvé."}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def orders_view(request):
    try:
        client_profile = request.user.client_profile
        orders = Echange.objects.filter(utilisateur=request.user).select_related('boutique')
        serializer = EchangeSerializer(orders, many=True)
        return Response(serializer.data)
    except Client.DoesNotExist:
        return Response(
            {"message": "User is not a client."},
            status=status.HTTP_403_FORBIDDEN
        )