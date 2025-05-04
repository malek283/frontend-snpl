from rest_framework import serializers

from boutique.models import Produit
from .models import Panier, LignePanier
from boutique.serializers import ProduitSerializer

class LignePanierWriteSerializer(serializers.ModelSerializer):
    produit = serializers.PrimaryKeyRelatedField(queryset=Produit.objects.all())

    class Meta:
        model = LignePanier
        fields = ['id', 'produit', 'quantite']

class LignePanierReadSerializer(serializers.ModelSerializer):
    produit = ProduitSerializer()

    class Meta:
        model = LignePanier
        fields = ['id', 'produit', 'quantite', 'created_at']


class PanierSerializer(serializers.ModelSerializer):
    lignes = LignePanierReadSerializer(many=True, read_only=True)

    class Meta:
        model = Panier
        fields = ['id', 'client', 'lignes', 'created_at', 'updated_at']
