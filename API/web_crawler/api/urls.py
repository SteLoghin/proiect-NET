from django.urls import include, path
from . import views
from rest_framework import routers


router = routers.DefaultRouter()
router.register(r'properties', views.PropertyViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('crawler/', views.Crawler.as_view()),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]