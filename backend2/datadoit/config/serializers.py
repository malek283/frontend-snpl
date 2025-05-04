from rest_framework import serializers
from .models import Configurer

class ConfigurerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Configurer
        fields = ['id', 'boutique', 'parametre', 'created_at', 'updated_at']