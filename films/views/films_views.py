from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from films.models import Film, FilmAndPerson
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


@api_view(['GET'])
@permission_classes([AllowAny])
def get_films_by_person_and_role(request):
    person_id = request.query_params.get("person_id")
    role = request.query_params.get("role")
    page_size = int(request.query_params.get("page_size", 20))

    film_ids = (
        FilmAndPerson.objects
        .filter(
            person_id=person_id,
            role__name=role,
            active=True,
            deleted=False,
            film__active=True,
            film__deleted=False
        )
        .values_list("film_id", flat=True)
        .distinct()
    )

    films = (
        Film.objects
        .filter(film_id__in=film_ids)
        .order_by("-popularity")
    )

    paginator = PageNumberPagination()
    paginator.page_size = page_size
    page = paginator.paginate_queryset(films, request)
    serializer = MiniFilmSerializer(page, many=True)
    return paginator.get_paginated_response(serializer.data)
