from rest_framework import serializers
from users.models import Marchand
from .models import CategoryBoutique, Boutique, CategoryProduit, Produit

class CategoryBoutiqueSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = CategoryBoutique
        fields = ['id', 'nom', 'image', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_image(self, obj):
        if not obj.image:
            return None
            
        if hasattr(obj.image, 'url'):
            return f"{obj.image.url}"
        return obj.image  # Si c'est déjà une URL

class MarchandSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = Marchand
        fields = ['user', 'is_marchant']

class BoutiqueSerializer(serializers.ModelSerializer):
    marchand = serializers.StringRelatedField()
  
    logo = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Boutique
        fields = [
            'id', 'nom', 'description', 'logo', 'adresse', 'telephone', 'email',
            'image', 'category_boutique', 'marchand', 'created_at', 'updated_at'
        ]
        read_only_fields = ['marchand', 'created_at', 'updated_at']

    def get_logo(self, obj):
        if not obj.logo:
            return None
            
        if hasattr(obj.logo, 'url'):
            return f"http://localhost:8000{obj.logo.url}"
        return obj.logo  # Si c'est déjà une URL

    def get_image(self, obj):
        if not obj.image:
            return None
            
        if hasattr(obj.image, 'url'):
            return f"http://localhost:8000{obj.image.url}"
        return obj.image  # Si c'est déjà une URL

class CategoryProduitSerializer(serializers.ModelSerializer):
    boutique = serializers.PrimaryKeyRelatedField(
        queryset=Boutique.objects.all(),
        required=True
    )
    image = serializers.SerializerMethodField()

    class Meta:
        model = CategoryProduit
        fields = ['id', 'nom', 'image', 'boutique']
        read_only_fields = ['created_at', 'updated_at']

    def get_image(self, obj):
        if not obj.image:
            return None
            
        if hasattr(obj.image, 'url'):
            return f"http://localhost:8000{obj.image.url}"
        return obj.image  # Si c'est déjà une URL

    def validate(self, data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            boutique = data.get('boutique')
            if boutique and boutique.marchand.user != request.user:
                raise serializers.ValidationError("You do not own this boutique.")
        return data

    def create(self, validated_data):
        image = validated_data.pop('image', None)
        category_produit = CategoryProduit.objects.create(**validated_data)
        if image:
            category_produit.image = image
            category_produit.save()
        return category_produit

class ProduitSerializer(serializers.ModelSerializer):
    category_produit = serializers.PrimaryKeyRelatedField(
        queryset=CategoryProduit.objects.all(),
        required=True
    )
    boutique = serializers.PrimaryKeyRelatedField(
        queryset=Boutique.objects.all(),
        required=True
    )
    category_produit_details = CategoryProduitSerializer(source='category_produit', read_only=True)
    boutique_details = BoutiqueSerializer(source='boutique', read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Produit
        fields = [
            'id', 'nom', 'description', 'prix', 'stock', 'image', 'couleur', 'taille',
            'category_produit', 'category_produit_details', 'boutique', 'boutique_details',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'category_produit_details', 'boutique_details']

    def get_image(self, obj):
        if not obj.image:
            return None
            
        if hasattr(obj.image, 'url'):
            return f"http://localhost:8000{obj.image.url}"
        return obj.image  # Si c'est déjà une URL

    def validate(self, data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            boutique = data.get('boutique')
            category_produit = data.get('category_produit')
            if boutique and boutique.marchand.user != request.user:
                raise serializers.ValidationError("You do not own this boutique.")
            if category_produit and category_produit.boutique != boutique:
                raise serializers.ValidationError("The category does not belong to the specified boutique.")
        return data

    def create(self, validated_data):
        image = validated_data.pop('image', None)
        produit = Produit.objects.create(**validated_data)
        if image:
            produit.image = image
            produit.save()
        return produit