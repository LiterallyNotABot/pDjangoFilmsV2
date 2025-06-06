from django.db.models import Avg, Count, Q
from django.core.paginator import Paginator

def get_weighted_rating_queryset(filtered_qs, page_size, page_number):
    annotated_qs = filtered_qs.annotate(
        avg_rating=Avg(
            "filmanduser__rating__rating_value",
            filter=Q(
                filmanduser__rating__isnull=False,
                filmanduser__deleted=False,
                filmanduser__rating__deleted=False,
            )
        ),
        vote_count=Count(
            "filmanduser__rating",
            filter=Q(
                filmanduser__rating__isnull=False,
                filmanduser__deleted=False,
                filmanduser__rating__deleted=False,
            )
        )
    )

    films = list(annotated_qs)

    ratings_with_values = [f.avg_rating for f in films if f.avg_rating is not None]
    C = sum(ratings_with_values) / len(ratings_with_values) if ratings_with_values else 0
    m = 25  # mínimo de votos requeridos para tener peso completo

    for f in films:
        v = f.vote_count or 0
        r = f.avg_rating or 0
        f.weighted_score = ((v / (v + m)) * r) + ((m / (v + m)) * C) if (v + m) > 0 else 0

    sorted_films = sorted(films, key=lambda f: f.weighted_score, reverse=True)

    paginator = Paginator(sorted_films, page_size)
    page = paginator.get_page(page_number)
    return paginator.count, page.object_list