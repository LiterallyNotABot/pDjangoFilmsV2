from rest_framework import generics
from films.models import Film
from films.serializers import FilmSerializer
from rest_framework.permissions import AllowAny

class FilmListAPIView(generics.ListAPIView):
    queryset = Film.objects.filter(active=True, deleted=False)
    serializer_class = FilmSerializer
    permission_classes = [AllowAny]

class FilmDetailAPIView(generics.RetrieveAPIView):
    queryset = Film.objects.filter(active=True, deleted=False)
    serializer_class = FilmSerializer
    lookup_field = "film_id"
    permission_classes = [AllowAny]
