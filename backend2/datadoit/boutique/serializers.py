from rest_framework import serializers
from users.models import Marchand, User
from .models import CategoryBoutique, Boutique, CategoryProduit, Produit
import logging
import os
from django.db import transaction

logger = logging.getLogger(__name__)

class CategoryBoutiqueSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    image_file = serializers.ImageField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = CategoryBoutique
        fields = ['id', 'nom', 'image', 'image_file', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_image(self, obj):
        # Refresh from database to ensure latest state
        obj.refresh_from_db()
        logger.debug(f"CategoryBoutique {obj.nom} (id: {obj.id}) refreshed, image: {obj.image}")
        if not obj.image:
            logger.debug(f"CategoryBoutique {obj.nom} (id: {obj.id}) has no image, raw value: {obj.image}")
            return None
        request = self.context.get('request')
        try:
            if hasattr(obj.image, 'url'):
                full_url = request.build_absolute_uri(obj.image.url) if request else obj.image.url
                # Check if file exists
                file_path = obj.image.path
                if os.path.exists(file_path):
                    logger.debug(f"Image file exists for CategoryBoutique {obj.nom} (id: {obj.id}) at: {file_path}")
                else:
                    logger.error(f"Image file missing for CategoryBoutique {obj.nom} (id: {obj.id}) at: {file_path}")
                logger.debug(f"CategoryBoutique {obj.nom} (id: {obj.id}) image URL: {full_url}")
                return full_url
            logger.warning(f"CategoryBoutique {obj.nom} (id: {obj.id}) image has no URL attribute, raw value: {obj.image}")
            return str(obj.image)
        except Exception as e:
            logger.error(f"Error generating image URL for CategoryBoutique {obj.nom} (id: {obj.id}): {str(e)}")
            return None

    def create(self, validated_data):
        image_file = validated_data.pop('image_file', None)
        logger.debug(f"Creating CategoryBoutique with validated_data: {validated_data}, image_file: {image_file}")
        with transaction.atomic():
            instance = super().create(validated_data)
            if image_file:
                try:
                    instance.image = image_file
                    instance.save()
                    file_path = instance.image.path
                    logger.debug(f"Saved image for CategoryBoutique {instance.nom} (id: {instance.id}): {instance.image}, path: {file_path}")
                    if os.path.exists(file_path):
                        logger.debug(f"Image file exists at: {file_path}")
                    else:
                        logger.error(f"Image file not found at: {file_path}")
                    instance.refresh_from_db()
                    logger.debug(f"Database state after save: image={instance.image}")
                    # Additional check after save
                    if instance.image:
                        logger.debug(f"Post-save verification: image field is {instance.image}")
                        if not os.path.exists(instance.image.path):
                            logger.error(f"Post-save verification: image file missing at {instance.image.path}")
                    else:
                        logger.error(f"Post-save verification: image field is null for CategoryBoutique {instance.nom} (id: {instance.id})")
                except Exception as e:
                    logger.error(f"Error saving image for CategoryBoutique {instance.nom} (id: {instance.id}): {str(e)}")
                    raise
            else:
                logger.debug(f"No image provided for CategoryBoutique {instance.nom} (id: {instance.id})")
        return instance

    def update(self, instance, validated_data):
        image_file = validated_data.pop('image_file', None)
        logger.debug(f"Updating CategoryBoutique with validated_data: {validated_data}, image_file: {image_file}")
        with transaction.atomic():
            instance = super().update(instance, validated_data)
            if image_file:
                try:
                    instance.image = image_file
                    instance.save()
                    file_path = instance.image.path
                    logger.debug(f"Updated image for CategoryBoutique {instance.nom} (id: {instance.id}): {instance.image}, path: {file_path}")
                    if os.path.exists(file_path):
                        logger.debug(f"Image file exists at: {file_path}")
                    else:
                        logger.error(f"Image file not found at: {file_path}")
                    instance.refresh_from_db()
                    logger.debug(f"Database state after update: image={instance.image}")
                    # Additional check after update
                    if instance.image:
                        logger.debug(f"Post-update verification: image field is {instance.image}")
                        if not os.path.exists(instance.image.path):
                            logger.error(f"Post-update verification: image file missing at {instance.image.path}")
                    else:
                        logger.error(f"Post-update verification: image field is null for CategoryBoutique {instance.nom} (id: {instance.id})")
                except Exception as e:
                    logger.error(f"Error updating image for CategoryBoutique {instance.nom} (id: {instance.id}): {str(e)}")
                    raise
        return instance

class MarchandSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = Marchand
        fields = ['user', 'is_marchant']

from rest_framework import serializers
from .models import Boutique
import logging
from django.db import transaction
import os

logger = logging.getLogger(__name__)
from rest_framework import serializers
from .models import Boutique
import logging
from django.db import transaction
import os

logger = logging.getLogger(__name__)

class BoutiqueSerializer(serializers.ModelSerializer):
    marchand = serializers.StringRelatedField()
    logo = serializers.SerializerMethodField()  # For returning logo URL
    image = serializers.SerializerMethodField()  # For returning image URL
    logo_input = serializers.ImageField(write_only=True, required=False, allow_null=True, source='logo')  # For file upload
    image_input = serializers.ImageField(write_only=True, required=False, allow_null=True, source='image')  # For file upload

    class Meta:
        model = Boutique
        fields = [
            'id', 'nom', 'description', 'logo', 'logo_input', 'adresse', 'telephone', 'email',
            'image', 'image_input', 'category_boutique', 'marchand', 'created_at', 'updated_at'
        ]
        read_only_fields = ['marchand', 'created_at', 'updated_at']

    def get_logo(self, obj):
        if not obj.logo:
            logger.debug(f"Boutique {obj.nom} (id: {obj.id}) has no logo, raw value: {obj.logo}")
            return None
        request = self.context.get('request')
        try:
            if hasattr(obj.logo, 'url'):
                full_url = request.build_absolute_uri(obj.logo.url) if request else obj.logo.url
                logger.debug(f"Boutique {obj.nom} (id: {obj.id}) logo URL: {full_url}")
                return full_url
            logger.warning(f"Boutique {obj.nom} (id: {obj.id}) logo has no URL attribute, raw value: {obj.logo}")
            return str(obj.logo)
        except Exception as e:
            logger.error(f"Error generating logo URL for Boutique {obj.nom} (id: {obj.id}): {str(e)}")
            return None

    def get_image(self, obj):
        if not obj.image:
            logger.debug(f"Boutique {obj.nom} (id: {obj.id}) has no image, raw value: {obj.image}")
            return None
        request = self.context.get('request')
        try:
            if hasattr(obj.image, 'url'):
                full_url = request.build_absolute_uri(obj.image.url) if request else obj.image.url
                logger.debug(f"Boutique {obj.nom} (id: {obj.id}) image URL: {full_url}")
                return full_url
            logger.warning(f"Boutique {obj.nom} (id: {obj.id}) image has no URL attribute, raw value: {obj.image}")
            return str(obj.image)
        except Exception as e:
            logger.error(f"Error generating image URL for Boutique {obj.nom} (id: {obj.id}): {str(e)}")
            return None

    def create(self, validated_data):
        logo_file = validated_data.pop('logo', None)  # Pop 'logo' (from logo_input)
        image_file = validated_data.pop('image', None)  # Pop 'image' (from image_input)
        logger.debug(f"Creating Boutique with validated_data: {validated_data}, logo_file: {logo_file}, image_file: {image_file}")
        with transaction.atomic():
            instance = super().create(validated_data)
            try:
                if logo_file:
                    instance.logo = logo_file
                    logger.debug(f"Assigned logo for Boutique {instance.nom} (id: {instance.id}): {instance.logo}")
                if image_file:
                    instance.image = image_file
                    logger.debug(f"Assigned image for Boutique {instance.nom} (id: {instance.id}): {instance.image}")
                if logo_file or image_file:
                    instance.save()
                    logger.debug(f"Saved Boutique {instance.nom} (id: {instance.id}): logo={instance.logo}, path={instance.logo.path if instance.logo else None}, image={instance.image}, path={instance.image.path if instance.image else None}")
                    if logo_file and instance.logo and not os.path.exists(instance.logo.path):
                        logger.error(f"Logo file not found at: {instance.logo.path}")
                    if image_file and instance.image and not os.path.exists(instance.image.path):
                        logger.error(f"Image file not found at: {instance.image.path}")
                    instance.refresh_from_db()
                    logger.debug(f"Database state after save: logo={instance.logo}, image={instance.image}")
                else:
                    logger.debug(f"No images provided for Boutique {instance.nom} (id: {instance.id})")
            except Exception as e:
                logger.error(f"Error saving images for Boutique {instance.nom} (id: {instance.id}): {str(e)}")
                raise
        return instance

    def update(self, instance, validated_data):
        logo_file = validated_data.pop('logo', None)  # Pop 'logo' (from logo_input)
        image_file = validated_data.pop('image', None)  # Pop 'image' (from image_input)
        logger.debug(f"Updating Boutique with validated_data: {validated_data}, logo_file: {logo_file}, image_file: {image_file}")
        with transaction.atomic():
            instance = super().update(instance, validated_data)
            try:
                if logo_file:
                    instance.logo = logo_file
                    logger.debug(f"Assigned logo for Boutique {instance.nom} (id: {instance.id}): {instance.logo}")
                if image_file:
                    instance.image = image_file
                    logger.debug(f"Assigned image for Boutique {instance.nom} (id: {instance.id}): {instance.image}")
                if logo_file or image_file:
                    instance.save()
                    logger.debug(f"Updated Boutique {instance.nom} (id: {instance.id}): logo={instance.logo}, path={instance.logo.path if instance.logo else None}, image={instance.image}, path={instance.image.path if instance.image else None}")
                    if logo_file and instance.logo and not os.path.exists(instance.logo.path):
                        logger.error(f"Logo file not found at: {instance.logo.path}")
                    if image_file and instance.image and not os.path.exists(instance.image.path):
                        logger.error(f"Image file not found at: {instance.image.path}")
                    instance.refresh_from_db()
                    logger.debug(f"Database state after update: logo={instance.logo}, image={instance.image}")
            except Exception as e:
                logger.error(f"Error updating images for Boutique {instance.nom} (id: {instance.id}): {str(e)}")
                raise
        return instance
class CategoryProduitSerializer(serializers.ModelSerializer):
    boutique = serializers.PrimaryKeyRelatedField(
        queryset=Boutique.objects.all(),
        required=True
    )
    image = serializers.SerializerMethodField()
    image_file = serializers.ImageField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = CategoryProduit
        fields = ['id', 'nom', 'image', 'image_file', 'boutique']
        read_only_fields = ['created_at', 'updated_at']

    def get_image(self, obj):
        if not obj.image:
            logger.debug(f"CategoryProduit {obj.nom} (id: {obj.id}) has no image, raw value: {obj.image}")
            return None
        request = self.context.get('request')
        try:
            if hasattr(obj.image, 'url'):
                full_url = request.build_absolute_uri(obj.image.url) if request else obj.image.url
                logger.debug(f"CategoryProduit {obj.nom} (id: {obj.id}) image URL: {full_url}")
                return full_url
            logger.warning(f"CategoryProduit {obj.nom} (id: {obj.id}) image has no URL attribute, raw value: {obj.image}")
            return str(obj.image)
        except Exception as e:
            logger.error(f"Error generating image URL for CategoryProduit {obj.nom} (id: {obj.id}): {str(e)}")
            return None

    def validate(self, data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            boutique = data.get('boutique')
            if boutique and boutique.marchand.user != request.user:
                raise serializers.ValidationError("You do not own this boutique.")
        logger.debug(f"Validated data: {data}")
        return data

    def create(self, validated_data):
        image_file = validated_data.pop('image_file', None)
        logger.debug(f"Creating CategoryProduit with validated_data: {validated_data}, image_file: {image_file}")
        with transaction.atomic():
            instance = super().create(validated_data)
            if image_file:
                try:
                    instance.image = image_file
                    instance.save()
                    logger.debug(f"Saved image for CategoryProduit {instance.nom} (id: {instance.id}): {instance.image}, path: {instance.image.path}")
                    if os.path.exists(instance.image.path):
                        logger.debug(f"Image file exists at: {instance.image.path}")
                    else:
                        logger.error(f"Image file not found at: {instance.image.path}")
                    instance.refresh_from_db()
                    logger.debug(f"Database state after save: image={instance.image}")
                except Exception as e:
                    logger.error(f"Error saving image for CategoryProduit {instance.nom} (id: {instance.id}): {str(e)}")
                    raise
            else:
                logger.debug(f"No image provided for CategoryProduit {instance.nom} (id: {instance.id})")
        return instance

    def update(self, instance, validated_data):
        image_file = validated_data.pop('image_file', None)
        logger.debug(f"Updating CategoryProduit with validated_data: {validated_data}, image_file: {image_file}")
        with transaction.atomic():
            instance = super().update(instance, validated_data)
            if image_file:
                try:
                    instance.image = image_file
                    instance.save()
                    logger.debug(f"Updated image for CategoryProduit {instance.nom} (id: {instance.id}): {instance.image}, path: {instance.image.path}")
                    if os.path.exists(instance.image.path):
                        logger.debug(f"Image file exists at: {instance.image.path}")
                    else:
                        logger.error(f"Image file not found at: {instance.image.path}")
                    instance.refresh_from_db()
                    logger.debug(f"Database state after update: image={instance.image}")
                except Exception as e:
                    logger.error(f"Error updating image for CategoryProduit {instance.nom} (id: {instance.id}): {str(e)}")
                    raise
        return instance

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
    image_file = serializers.ImageField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = Produit
        fields = [
            'id', 'nom', 'description', 'prix', 'stock', 'image', 'image_file', 'couleur', 'taille',
            'category_produit', 'category_produit_details', 'boutique', 'boutique_details',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'category_produit_details', 'boutique_details']

    def __init__(self, *args, **kwargs):
        context = kwargs.get('context', {})
        super().__init__(*args, **kwargs)
        self.fields['category_produit_details'] = CategoryProduitSerializer(
            source='category_produit', read_only=True, context=context
        )
        self.fields['boutique_details'] = BoutiqueSerializer(
            source='boutique', read_only=True, context=context
        )

    def get_image(self, obj):
        if not obj.image:
            logger.debug(f"Produit {obj.nom} (id: {obj.id}) has no image, raw value: {obj.image}")
            return None
        request = self.context.get('request')
        try:
            if hasattr(obj.image, 'url'):
                full_url = request.build_absolute_uri(obj.image.url) if request else obj.image.url
                logger.debug(f"Produit {obj.nom} (id: {obj.id}) image URL: {full_url}")
                return full_url
            logger.warning(f"Produit {obj.nom} (id: {obj.id}) image has no URL attribute, raw value: {obj.image}")
            return str(obj.image)
        except Exception as e:
            logger.error(f"Error generating image URL for Produit {obj.nom} (id: {obj.id}): {str(e)}")
            return None

    def validate(self, data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            boutique = data.get('boutique')
            category_produit = data.get('category_produit')
            if boutique and boutique.marchand.user != request.user:
                raise serializers.ValidationError("You do not own this boutique.")
            if category_produit and category_produit.boutique != boutique:
                raise serializers.ValidationError("The category does not belong to the specified boutique.")
        logger.debug(f"Validated data: {data}")
        return data

    def create(self, validated_data):
        image_file = validated_data.pop('image_file', None)
        logger.debug(f"Creating Produit with validated_data: {validated_data}, image_file: {image_file}")
        with transaction.atomic():
            instance = super().create(validated_data)
            if image_file:
                try:
                    instance.image = image_file
                    instance.save()
                    logger.debug(f"Saved image for Produit {instance.nom} (id: {instance.id}): {instance.image}, path: {instance.image.path}")
                    if os.path.exists(instance.image.path):
                        logger.debug(f"Image file exists at: {instance.image.path}")
                    else:
                        logger.error(f"Image file not found at: {instance.image.path}")
                    instance.refresh_from_db()
                    logger.debug(f"Database state after save: image={instance.image}")
                except Exception as e:
                    logger.error(f"Error saving image for Produit {instance.nom} (id: {instance.id}): {str(e)}")
                    raise
            else:
                logger.debug(f"No image provided for Produit {instance.nom} (id: {instance.id})")
        return instance

    def update(self, instance, validated_data):
        image_file = validated_data.pop('image_file', None)
        logger.debug(f"Updating Produit with validated_data: {validated_data}, image_file: {image_file}")
        with transaction.atomic():
            instance = super().update(instance, validated_data)
            if image_file:
                try:
                    instance.image = image_file
                    instance.save()
                    logger.debug(f"Updated image for Produit {instance.nom} (id: {instance.id}): {instance.image}, path: {instance.image.path}")
                    if os.path.exists(instance.image.path):
                        logger.debug(f"Image file exists at: {instance.image.path}")
                    else:
                        logger.error(f"Image file not found at: {instance.image.path}")
                    instance.refresh_from_db()
                    logger.debug(f"Database state after update: image={instance.image}")
                except Exception as e:
                    logger.error(f"Error updating image for Produit {instance.nom} (id: {instance.id}): {str(e)}")
                    raise
        return instance
    

class CategoryBoutiqueSerializerall(serializers.ModelSerializer):
    class Meta:
        model = CategoryBoutique
        fields = ['id', 'nom']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'nom', ]
class MarchandSerializerall(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Marchand
        fields = [ 'is_marchant','user']

class BoutiqueSerializerall(serializers.ModelSerializer):
    category_boutique = CategoryBoutiqueSerializer(read_only=True)
    marchand = MarchandSerializerall(read_only=True)

    class Meta:
        model = Boutique
        fields = [
            'id',
            'nom',
            'description',
            'logo',
            'adresse',
            'telephone',
            'email',
            'image',
            'category_boutique',
            'marchand',
            'created_at',
            'updated_at'
        ]    