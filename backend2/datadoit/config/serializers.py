from rest_framework import serializers
from .models import RemiseType, Configurer
from boutique.models import Boutique
import json

class RemiseTypeSerializer(serializers.ModelSerializer):
    type_remise_display = serializers.CharField(source='get_type_remise_display', read_only=True)
    boutique = serializers.PrimaryKeyRelatedField(queryset=Boutique.objects.all(), allow_null=True)
    
    class Meta:
        model = RemiseType
        fields = [
            'id',
            'boutique',
            'duree_plan_paiement',
            'type_remise',
            'type_remise_display',
            'nombre_tranches',
            'pourcentage_remise',
            'montant_max_remise',
            'date_creation',
        ]
    
    def validate(self, data):
        # Only enforce nombre_tranches requirement if type_remise is explicitly set to 'tranches'
        type_remise = data.get('type_remise', getattr(self.instance, 'type_remise', None) if self.instance else None)
        nombre_tranches = data.get('nombre_tranches', getattr(self.instance, 'nombre_tranches', None) if self.instance else None)
        
        if type_remise == 'tranches' and (nombre_tranches is None or nombre_tranches <= 0):
            raise serializers.ValidationError("Nombre de tranches must be a positive integer for type 'tranches'.")
        
        if not data.get('boutique') and not self.instance:
            raise serializers.ValidationError("Boutique is required for new remise types.")
        
        return data

    def update(self, instance, validated_data):
        # Prevent changing boutique during update
        validated_data.pop('boutique', None)
        return super().update(instance, validated_data)

class ConfigurerSerializer(serializers.ModelSerializer):
    boutique = serializers.PrimaryKeyRelatedField(queryset=Boutique.objects.all())
    parametre = serializers.JSONField()
    
    class Meta:
        model = Configurer
        fields = ['id', 'boutique', 'parametre', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        parametre_data = validated_data.pop('parametre')
        parametre_json = json.dumps(parametre_data)
        configurer = Configurer.objects.create(parametre=parametre_json, **validated_data)
        return configurer
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        try:
            representation['parametre'] = json.loads(instance.parametre)
        except json.JSONDecodeError:
            representation['parametre'] = {}
        return representation