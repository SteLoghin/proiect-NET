from .models import Property
from rest_framework import serializers

class PropertySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Property
        fields = ('rooms', 'area', 'floor', 'year', 'bathrooms', 'kitchens', 'link', 'zone', 'price')