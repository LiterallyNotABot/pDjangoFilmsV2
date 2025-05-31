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

    base_qs = get_base_film_queryset().filter(film_id__in=film_ids)
    filtered_qs = apply_film_filters(base_qs, request.query_params).order_by("-popularity")

    paginator = PageNumberPagination()
    paginator.page_size = page_size
    page = paginator.paginate_queryset(filtered_qs, request)

    serializer = MiniFilmSerializer(page, many=True)
    return paginator.get_paginated_response(serializer.data)
