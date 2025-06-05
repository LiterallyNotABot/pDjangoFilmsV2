from django.urls import path
from films.views import films_by_person_views
from films.views.films_views import LatestFilmsView, FilmDetailAPIView, FilmListAPIView, get_filtered_films

urlpatterns = [
    path("by-person/", films_by_person_views.get_films_by_person_and_role),
    path("latest/", LatestFilmsView.as_view(), name="film-latest"),
    path("<int:film_id>/", FilmDetailAPIView.as_view(), name="film-detail"),
    path("", FilmListAPIView.as_view(), name="film-list"),
    path("filtered/", get_filtered_films, name="film-filtered"),
]