from django.urls import path
from films.views import films_by_person_views
from films.views.company_views import get_company_by_id
from films.views.country_views import get_country_by_id
from films.views.films_views import LatestFilmsView, FilmDetailAPIView, FilmListAPIView, get_filtered_films, \
    GenreListView
from films.views.genre_views import get_genre_by_id
from films.views.language_views import get_language_by_id


urlpatterns = [
    path("by-person/", films_by_person_views.get_films_by_person_and_role),
    path("latest/", LatestFilmsView.as_view(), name="film-latest"),
    path("<int:film_id>/", FilmDetailAPIView.as_view(), name="film-detail"),
    path("", FilmListAPIView.as_view(), name="film-list"),
    path("filtered/", get_filtered_films, name="film-filtered"),
    path("genres/", GenreListView.as_view(), name="genre-list"),

    path("companies/<int:pk>/", get_company_by_id),
    path("genres/<int:pk>/", get_genre_by_id),
    path("countries/<int:pk>/", get_country_by_id),
    path("languages/<int:pk>/", get_language_by_id),

]