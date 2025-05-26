from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from films.models import Film
from films.serializers.serializers import FilmSerializer
from rest_framework.permissions import AllowAny
from rest_framework import status
from films.serializers.mini_film_serializer import MiniFilmSerializer

class FilmListAPIView(generics.ListAPIView):
    queryset = Film.objects.filter(active=True, deleted=False)
    serializer_class = FilmSerializer
    permission_classes = [AllowAny]

class FilmDetailAPIView(generics.RetrieveAPIView):
    queryset = Film.objects.filter(active=True, deleted=False)
    serializer_class = FilmSerializer
    lookup_field = "film_id"
    permission_classes = [AllowAny]

class LatestFilmsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            limit = int(request.query_params.get("limit", 10))
        except ValueError:
            limit = 10

        films = Film.objects.filter(active=True, deleted=False).order_by("-film_id")[:limit]
        serializer = MiniFilmSerializer(films, many=True)
        return Response(serializer.data)

