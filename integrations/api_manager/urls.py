from django.urls import path, include
from rest_framework.routers import DefaultRouter
from integrations.api_manager.views import FilmViewSet, PersonViewSet

router = DefaultRouter()
router.register(r'films', FilmViewSet)
router.register(r'persons', PersonViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

