from rest_framework import serializers
from boutique.models import Boutique
from users.models import Admin, User, Client, Marchand
from django.contrib.auth import authenticate
from django.db import IntegrityError, transaction

from django.contrib.auth import get_user_model



User = get_user_model()






class UserSerializer(serializers.ModelSerializer):
    solde_points = serializers.IntegerField(source='client.solde_points', read_only=True, required=False)
    historique_achats = serializers.CharField(source='client.historique_achats', read_only=True, required=False)
  
    has_boutique = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'nom', 'prenom', 'telephone', 'role',
            'is_active', 'is_approved', 'is_staff', 'created_at', 'updated_at',
            'solde_points', 'historique_achats',
            'has_boutique'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'is_staff', 'is_approved']

    

   

    def get_has_boutique(self, obj):
        if obj.role == 'marchand' and hasattr(obj, 'marchand_profile'):
           return Boutique.objects.filter(marchand=obj.marchand_profile).exists()
        return False


    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.role != 'client':
            representation.pop('solde_points', None)
            representation.pop('historique_achats', None)
        if instance.role != 'marchand':
            representation.pop('has_boutique', None)
        return representation

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(email=data['email'], password=data['password'])
        if user and user.is_active:
            return {'user': user}
        raise serializers.ValidationError('Invalid credentials')
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Client, Marchand, Admin
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['solde_points', 'historique_achats']
        extra_kwargs = {
            'solde_points': {'default': 0, 'allow_null': True, 'required': False},
            'historique_achats': {'allow_blank': True, 'allow_null': True, 'required': False}
        }

class MarchandSerializer(serializers.ModelSerializer):
    is_marchant = serializers.BooleanField(default=True, write_only=True)
    
    class Meta:
        model = Marchand
        fields = ['is_marchant']
        extra_kwargs = {
            'is_marchant': {'required': False}
        }

class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = []
class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = [
            'email', 'nom', 'prenom', 'telephone', 'adresse', 'role',
            'password', 'confirm_password'
        ]
        extra_kwargs = {
            'role': {'default': 'client'},
            'adresse': {'required': False, 'allow_null': True}
        }

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Les mots de passe ne correspondent pas."})
        
        if User.objects.filter(email=data['email'].lower()).exists():
            raise serializers.ValidationError({"email": "Cet email est déjà utilisé."})
        
        return data

    @transaction.atomic
    def create(self, validated_data):
        try:
            # Extraction et normalisation des données
            role = validated_data.pop('role', 'client')
            validated_data.pop('confirm_password')
            validated_data['email'] = validated_data['email'].lower()
            
            # FORCE le rôle dans les données de création
            validated_data['role'] = role
            
            # Création de l'utilisateur
            user = User.objects.create_user(**validated_data)
            
            # Création du profil spécifique
            if role == 'client':
                Client.objects.create(user=user)
            elif role == 'marchand':
                Marchand.objects.create(user=user)
            elif role == 'admin':
                Admin.objects.create(user=user)
            
            # Recharge l'utilisateur pour s'assurer d'avoir les dernières données
            user.refresh_from_db()
            return user
            
        except IntegrityError as e:
            logger.error(f"IntegrityError: {str(e)}")
            raise serializers.ValidationError({
                'error': 'Erreur lors de la création du compte.'
            })
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}", exc_info=True)
            raise serializers.ValidationError({
                'error': 'Une erreur inattendue est survenue.'
            })
class UserUpdateSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=False)
    password = serializers.CharField(write_only=True, required=False, min_length=8)
    solde_points = serializers.IntegerField(required=False)
    historique_achats = serializers.CharField(allow_blank=True, allow_null=True, required=False)
   
    description = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = [
            'email', 'nom', 'prenom', 'telephone', 'password',
            'solde_points', 'historique_achats', 'description'
        ]
        read_only_fields = ['role']

    def validate(self, data):
        if self.instance.role == 'Client':
            if  'description' in data:
                raise serializers.ValidationError({"non_field_errors": "Client cannot update marchand-specific fields."})
        elif self.instance.role == 'Marchand':
            if 'solde_points' in data or 'historique_achats' in data:
                raise serializers.ValidationError({"non_field_errors": "Marchand cannot update client-specific fields."})
        elif self.instance.role == 'Admin':
            if any(key in data for key in ['solde_points', 'historique_achats',  'description']):
                raise serializers.ValidationError({"non_field_errors": "Admin cannot update client or marchand-specific fields."})
        return data

    def validate_email(self, value):
        if User.objects.filter(email=value).exclude(id=self.instance.id).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        
        if instance.role == 'Client':
            client = instance.client
            client.solde_points = validated_data.pop('solde_points', client.solde_points)
            client.historique_achats = validated_data.pop('historique_achats', client.historique_achats)
            client.save()
        elif instance.role == 'Marchand':
            marchand = instance.marchand
           
            marchand.description = validated_data.pop('description', marchand.description)
            marchand.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance