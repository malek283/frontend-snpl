from rest_framework import serializers
from .models import Badges, UserBadge

class BadgesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badges
        fields = ['id', 'nom', 'description', 'image', 'created_at', 'updated_at']

class UserBadgeSerializer(serializers.ModelSerializer):
    badge = BadgesSerializer()

    class Meta:
        model = UserBadge
        fields = ['id', 'user', 'badge', 'awarded_at']