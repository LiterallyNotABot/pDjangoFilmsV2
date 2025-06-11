from django.db.models import Count, Avg
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from users.models import FilmAndUser

@api_view(['GET'])
@permission_classes([AllowAny])
def get_rating_stats(request, film_id):
    segments = (
        FilmAndUser.objects
        .filter(
            film_id=film_id,
            deleted=False,
            rating__isnull=False,
            rating__deleted=False
        )
        .values("rating__rating_value")
        .annotate(count=Count("film_and_user_id"))
        .order_by("rating__rating_value")
    )

    avg_rating = (
        FilmAndUser.objects
        .filter(
            film_id=film_id,
            deleted=False,
            rating__isnull=False,
            rating__deleted=False
        )
        .aggregate(avg=Avg("rating__rating_value"))["avg"]
    )

    total = sum(seg["count"] for seg in segments)

    return Response({
        "average": avg_rating,
        "total": total,
        "segments": [
            {"value": float(seg["rating__rating_value"]), "count": seg["count"]}
            for seg in segments
        ]
    })
