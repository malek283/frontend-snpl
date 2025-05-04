from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from rewards.models import Badges, UserBadge
from .models import Panier, LignePanier
from .serializers import LignePanierWriteSerializer, PanierSerializer
from boutique.models import Echange
from users.models import Client

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def panier_view(request):
    # Check if user has a client profile
    try:
        client_profile = request.user.client_profile
        print('clien',client_profile);
    except Client.DoesNotExist:
        return Response(
            {"message": "User is not a client. Cart functionality is only available for clients."},
            status=status.HTTP_403_FORBIDDEN
        )

    panier, _ = Panier.objects.get_or_create(client=client_profile)

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
    # Check if user has a client profile
    try:
        client_profile = request.user.client_profile
    except Client.DoesNotExist:
        return Response(
            {"message": "User is not a client. Cart functionality is only available for clients."},
            status=status.HTTP_403_FORBIDDEN
        )

    panier, _ = Panier.objects.get_or_create(client=client_profile)
    serializer = LignePanierWriteSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(panier=panier)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



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

        # Créer un échange
        Echange.objects.create(boutique=boutique, utilisateur=request.user, montant=total)

        # Vérifier si c'est le premier achat
        if Echange.objects.filter(utilisateur=request.user).count() == 1:
            # Attribuer le badge "Premier achat"
            badge = Badges.objects.get(nom="Premier achat")
            UserBadge.objects.get_or_create(user=request.user, badge=badge)

        panier.lignes.all().delete()

        return Response({"message": "Checkout successful"}, status=status.HTTP_201_CREATED)

    except Panier.DoesNotExist:
        return Response({"message": "Panier non trouvé."}, status=status.HTTP_404_NOT_FOUND)
