from rest_framework import viewsets
from .serializers import FilmSerializer, GenreSerializer
from films.models import Film, Genre

class FilmViewSet(viewsets.ModelViewSet):
    queryset = Film.objects.all()
    serializer_class = FilmSerializer

class GenreViewSet(viewsets.ModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
