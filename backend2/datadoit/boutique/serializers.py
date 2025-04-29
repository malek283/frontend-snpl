from rest_framework import serializers
from .models import CategoryBoutique, Boutique, CategoryProduit, Produit

# Serializer pour la catégorie de boutique
class CategoryBoutiqueSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryBoutique
        fields = '__all__'  # Cela inclut tous les champs du modèle

# Serializer pour la boutique
class BoutiqueSerializer(serializers.ModelSerializer):
    category_boutique = CategoryBoutiqueSerializer(read_only=True)  # Inclut la catégorie de la boutique
    # Si tu veux inclure un champ pour la catégorie, tu peux ajouter :
    # category_boutique_id = serializers.PrimaryKeyRelatedField(queryset=CategoryBoutique.objects.all(), write_only=True)
    
    class Meta:
        model = Boutique
        fields = '__all__'  # Cela inclut tous les champs du modèle

# Serializer pour la catégorie de produit
class CategoryProduitSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryProduit
        fields = '__all__'  # Cela inclut tous les champs du modèle

# Serializer pour le produit
class ProduitSerializer(serializers.ModelSerializer):
    category_produit = CategoryProduitSerializer(read_only=True)  # Inclut la catégorie du produit
    boutique = BoutiqueSerializer(read_only=True)  # Inclut la boutique à laquelle appartient le produit

    class Meta:
        model = Produit
        fields = '__all__'  # Cela inclut tous les champs du modèle
