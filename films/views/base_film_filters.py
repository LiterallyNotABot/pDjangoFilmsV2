def get_base_film_queryset():
    from films.models import Film
    return Film.objects.filter(active=True, deleted=False)

def apply_film_filters(qs, params):
    from django.db.models import Q

    genre_id = params.get("genre")
    language_id = params.get("language")
    country_id = params.get("country")
    year = params.get("year")

    if genre_id:
        qs = qs.filter(filmandgenre__genre_id=genre_id)
    if language_id:
        qs = qs.filter(filmandlanguage__language_id=language_id)
    if country_id:
        qs = qs.filter(filmandcountry__country_id=country_id)
    if year:
        qs = qs.filter(release_year=year)

    return qs.distinct()
