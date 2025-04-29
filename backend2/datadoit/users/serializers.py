from rest_framework import serializers
from users.models import User, Client, Marchand
from django.contrib.auth import authenticate

class UserSerializer(serializers.ModelSerializer):
    solde_points = serializers.IntegerField(source='client.solde_points', read_only=True, required=False)
    historique_achats = serializers.CharField(source='client.historique_achats', read_only=True, required=False)
    boutique_nom = serializers.CharField(source='marchand.boutique_nom', read_only=True, required=False)
    description = serializers.CharField(source='marchand.description', read_only=True, required=False)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'nom', 'prenom', 'telephone', 'role',
            'is_active', 'is_approved', 'is_staff', 'created_at', 'updated_at',
            'solde_points', 'historique_achats', 'boutique_nom', 'description'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'is_staff', 'is_approved']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.role != 'client':
            representation.pop('solde_points', None)
            representation.pop('historique_achats', None)
        if instance.role != 'marchand':
            representation.pop('boutique_nom', None)
            representation.pop('description', None)
        return representation

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(email=data['email'], password=data['password'])
        if user and user.is_active:
            return {'user': user}
        raise serializers.ValidationError('Invalid credentials')

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)
    solde_points = serializers.IntegerField(default=0, allow_null=True, required=False)
    historique_achats = serializers.CharField(allow_blank=True, allow_null=True, required=False)
    boutique_nom = serializers.CharField(default='', allow_blank=True, required=False)
    description = serializers.CharField(default='', allow_blank=True, required=False)

    class Meta:
        model = User
        fields = [
            'email', 'nom', 'prenom', 'telephone', 'role',
            'password', 'confirm_password',
            'solde_points', 'historique_achats', 'boutique_nom', 'description'
        ]

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})

        valid_roles = [choice[0] for choice in User.ROLE_CHOICES]
        if data['role'] not in valid_roles:
            raise serializers.ValidationError({"role": f"Role must be one of {valid_roles}."})

        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({"email": "A user with this email already exists."})

        # Ensure role-specific fields are only provided for the correct role
        if data['role'] == 'marchand':
            # Allow solde_points and historique_achats, disallow marchand fields
            if any(key in data for key in ['boutique_nom', 'description']):
                if data.get('boutique_nom') or data.get('description'):  # Check if non-empty
                    raise serializers.ValidationError({"non_field_errors": "Client cannot have marchand-specific fields."})
        elif data['role'] == ' client':
            # Allow entreprise_nom and description, disallow client fields
            if any(key in data for key in ['solde_points', 'historique_achats']):
                if data.get('solde_points') is not None or data.get('historique_achats'):
                    raise serializers.ValidationError({"non_field_errors": "Marchand cannot have client-specific fields."})
        elif data['role'] == 'admin':
            # Disallow all role-specific fields
            if any(key in data for key in ['solde_points', 'historique_achats', 'boutique_nom', 'description']):
                if any(data.get(key) for key in ['solde_points', 'historique_achats', 'boutique_nom', 'description']):
                    raise serializers.ValidationError({"non_field_errors": "Admin cannot have client or marchand-specific fields."})

        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        role = validated_data.pop('role')
        
        if role == 'client':
            solde_points = validated_data.pop('solde_points', 0)
            historique_achats = validated_data.pop('historique_achats', None)
            validated_data.pop('boutique_nom', None)  # Remove marchand fields
            validated_data.pop('description', None)
            user = Client.objects.create_user(**validated_data, role=role)
            user.solde_points = solde_points
            user.historique_achats = historique_achats
            user.save()
        elif role == 'marchand':
            boutique_nom = validated_data.pop('boutique_nom', '')
            description = validated_data.pop('description', '')
            validated_data.pop('solde_points', None)  # Remove client fields
            validated_data.pop('historique_achats', None)
            user = Marchand.objects.create_user(**validated_data, role=role)
            user.boutique_nom = boutique_nom
            user.description = description
            user.save()
        else:  # admin
            validated_data.pop('solde_points', None)
            validated_data.pop('historique_achats', None)
            validated_data.pop('boutique_nom', None)
            validated_data.pop('description', None)
            user = User.objects.create_user(**validated_data, role=role)
        
        return user

class UserUpdateSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=False)
    password = serializers.CharField(write_only=True, required=False, min_length=8)
    solde_points = serializers.IntegerField(required=False)
    historique_achats = serializers.CharField(allow_blank=True, allow_null=True, required=False)
    boutique_nom = serializers.CharField(required=False)
    description = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = [
            'email', 'nom', 'prenom', 'telephone', 'password',
            'solde_points', 'historique_achats', 'entreboutique_nomprise_nom', 'description'
        ]
        read_only_fields = ['role']

    def validate(self, data):
        if self.instance.role == 'client':
            if 'boutique_nom' in data or 'description' in data:
                raise serializers.ValidationError({"non_field_errors": "Client cannot update marchand-specific fields."})
        elif self.instance.role == 'marchand':
            if 'solde_points' in data or 'historique_achats' in data:
                raise serializers.ValidationError({"non_field_errors": "Marchand cannot update client-specific fields."})
        elif self.instance.role == 'admin':
            if any(key in data for key in ['solde_points', 'historique_achats', 'boutique_nom', 'description']):
                raise serializers.ValidationError({"non_field_errors": "Admin cannot update client or marchand-specific fields."})
        return data

    def validate_email(self, value):
        if User.objects.filter(email=value).exclude(id=self.instance.id).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        
        if instance.role == 'client':
            client = instance.client
            client.solde_points = validated_data.pop('solde_points', client.solde_points)
            client.historique_achats = validated_data.pop('historique_achats', client.historique_achats)
            client.save()
        elif instance.role == 'marchand':
            marchand = instance.marchand
            marchand.boutique_nom = validated_data.pop('boutique_nom', marchand.boutique_nom)
            marchand.description = validated_data.pop('description', marchand.description)
            marchand.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance