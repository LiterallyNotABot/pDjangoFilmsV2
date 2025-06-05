def get_base_film_queryset():
    from films.models import Film
    return Film.objects.filter(active=True, deleted=False)

def apply_film_filters(qs, params):
    from django.db.models import Q

    genre_id = params.get("genre")
    language_id = params.get("language")
    country_id = params.get("country")
    company_id = params.get("company")
    year = params.get("year")

    if genre_id:
        qs = qs.filter(filmandgenre__genre_id=genre_id, filmandgenre__active=True, filmandgenre__deleted=False)
    if language_id:
        qs = qs.filter(filmandlanguage__language_id=language_id, filmandlanguage__active=True, filmandlanguage__deleted=False)
    if country_id:
        qs = qs.filter(filmandcountry__country_id=country_id, filmandcountry__active=True, filmandcountry__deleted=False)
    if company_id:
        qs = qs.filter(filmandproductioncompany__company_id=company_id, filmandproductioncompany__active=True, filmandproductioncompany__deleted=False)
    if year:
        qs = qs.filter(release_year=year)

    return qs.distinct()
