from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from films.models import FilmAndPerson, FilmAndGenre, Genre
from films.serializers.mini_film_serializer import MiniFilmSerializer
from films.views.base_film_filters import get_base_film_queryset, apply_film_filters

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from films.models import FilmAndPerson
from films.serializers.mini_film_serializer import MiniFilmSerializer
from films.views.base_film_filters import get_base_film_queryset, apply_film_filters


@api_view(['GET'])
@permission_classes([AllowAny])
def get_films_by_person_and_role(request):
    person_id = request.query_params.get("person_id")
    role = request.query_params.get("role")
    page_size = int(request.query_params.get("page_size", 20))

    # Obtener los IDs de películas asociadas a la persona y rol
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

    base_qs = get_base_film_queryset().filter(film_id__in=film_ids).order_by()
    sort_param = request.query_params.get("sort", "-popularity")

    allowed_sorts = {
        "title_asc": "title",
        "title_desc": "-title",

        "releaseDate_asc": "release_year",
        "releaseDate_desc": "-release_year",

        "filmLength_asc": "runtime",
        "filmLength_desc": "-runtime",

        "popularity_asc": "popularity",
        "popularity_desc": "-popularity",
    }

    order_by_field = allowed_sorts.get(sort_param, "-popularity")
    filtered_qs = apply_film_filters(base_qs, request.query_params).order_by(order_by_field)

    paginator = PageNumberPagination()
    paginator.page_size = page_size
    page = paginator.paginate_queryset(filtered_qs, request)

    serializer = MiniFilmSerializer(page, many=True)
    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_available_genres_by_person_and_role(request, person_id):
    role = request.query_params.get("role")
    if not role:
        return Response({"detail": "Missing role parameter"}, status=400)
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
    genres = (
        FilmAndGenre.objects
        .filter(
            film_id__in=film_ids,
            active=True,
            deleted=False,
            genre__active=True,
            genre__deleted=False
        )
        .values("genre__genre_id", "genre__genre_name")
        .distinct()
    )

    data = [
        {"id": g["genre__genre_id"], "name": g["genre__genre_name"]}
        for g in genres
    ]

    return Response(data)