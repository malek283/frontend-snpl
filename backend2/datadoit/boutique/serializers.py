from rest_framework import serializers
from .models import CategoryBoutique, Boutique, CategoryProduit, Produit

class CategoryBoutiqueSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(allow_null=True, required=False)

    class Meta:
        model = CategoryBoutique
        fields = ['id', 'nom', 'image', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class BoutiqueSerializer(serializers.ModelSerializer):
    category_boutique = CategoryBoutiqueSerializer(read_only=True)
    category_boutique_id = serializers.PrimaryKeyRelatedField(
        queryset=CategoryBoutique.objects.all(),
        source='category_boutique',
        write_only=True,
        allow_null=False,
    )
    image = serializers.ImageField(required=False, allow_null=True)
    logo = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = Boutique
        fields = [
            'id', 'nom', 'description', 'logo', 'adresse', 'telephone', 'email',
            'image', 'category_boutique', 'category_boutique_id', 'marchand',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
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
