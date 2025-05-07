from rest_framework import serializers
from boutique.models import Produit, Echange
from .models import Panier, LignePanier

class ProduitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produit
        fields = ['id', 'nom', 'prix', 'image', 'boutique']

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

class EchangeSerializer(serializers.ModelSerializer):
    boutique = serializers.StringRelatedField()
    shipping_info = serializers.JSONField()

    class Meta:
        model = Echange
        fields = ['id', 'boutique', 'montant', 'created_at', 'shipping_info']