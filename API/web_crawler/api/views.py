from django.http import JsonResponse, HttpResponse
from django.views import View
from rest_framework.decorators import api_view
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets

from .serializers import PropertySerializer
from .models import Property

class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer


@method_decorator(csrf_exempt, name='dispatch')
class Crawler(View):
    def post(self, request):
        property_instance = Property.objects.create(rooms=1, area=50, floor=5, year=2000, bathrooms=2, kitchens=1, link="testlink", zone="Iasi", price=200)
        if property_instance is None:
            return HttpResponse(content="Failed to collect data", status=204)
        else:
            return HttpResponse(content="Collected data", status=200)
