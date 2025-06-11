from django.core.paginator import Paginator
from django.db.models import Avg, Q, Count
from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView
from films.models import Film, FilmAndPerson, Genre
from films.serializers.serializers import FilmSerializer, GenreSerializer
from rest_framework.permissions import AllowAny
from rest_framework import status
from films.serializers.mini_film_serializer import MiniFilmSerializer
from films.views.base_film_filters import get_base_film_queryset, apply_film_filters
from films.views.helpers.weighted_rating_helper import get_weighted_rating_queryset
from films.views.ordering_criteria import ORDERING_CRITERIA


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

@api_view(['GET'])
@permission_classes([AllowAny])
def get_filtered_films(request):
    page_size = int(request.query_params.get("page_size", 20))
    page_number = int(request.query_params.get("page", 1))
    sort_param = request.query_params.get("sort", "popularity")

    queryset = get_base_film_queryset()
    filtered_qs = apply_film_filters(queryset, request.query_params)

    if sort_param == "userRating_weighted":
        total, page = get_weighted_rating_queryset(filtered_qs, page_size, page_number)
        serializer = MiniFilmSerializer(page, many=True)
        return Response({
            "count": total,
            "results": serializer.data
        })

    elif sort_param in ("userRating_desc", "userRating_asc"):
        order = "-avg_rating" if sort_param == "userRating_desc" else "avg_rating"

        filtered_qs = filtered_qs.annotate(
            avg_rating=Avg(
                "filmanduser__rating__rating_value",
                filter=Q(
                    filmanduser__rating__isnull=False,
                    filmanduser__deleted=False,
                    filmanduser__rating__deleted=False,
                )
            )
        ).order_by(order)

    else:
        ordering = ORDERING_CRITERIA.get(sort_param, ORDERING_CRITERIA["popularity"])["order_by"]
        filtered_qs = filtered_qs.order_by(ordering)

    paginator = PageNumberPagination()
    paginator.page_size = page_size
    page = paginator.paginate_queryset(filtered_qs, request)
    serializer = MiniFilmSerializer(page, many=True)
    return paginator.get_paginated_response(serializer.data)

class GenreListView(ListAPIView):
    queryset = Genre.objects.filter(active=True, deleted=False)
    serializer_class = GenreSerializer
    permission_classes = [AllowAny]
