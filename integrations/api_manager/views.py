from rest_framework import viewsets
from rest_framework_api_key.permissions import HasAPIKey
from films.models import Film, Person
from films.serializers import FilmSerializer, PersonSerializer


class FilmViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /films/
    GET /films/{id}/
    """
    queryset = Film.objects.filter(active=True, deleted=False)
    serializer_class = FilmSerializer
    permission_classes = [HasAPIKey]

class PersonViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /persons/
    GET /persons/{id}/
    """
    queryset = Person.objects.filter(active=True, deleted=False)
    serializer_class = PersonSerializer
    permission_classes = [HasAPIKey]
