from django.urls import path
from .views import films_by_person_views
from .views.films_by_person_views import get_available_genres_by_person_and_role
from .views.films_views import FilmListAPIView, FilmDetailAPIView, LatestFilmsView
from .views.person_views import get_person_by_id, get_person_roles

urlpatterns = [
    path("films/by-person/", films_by_person_views.get_films_by_person_and_role),
    path("films/latest/", LatestFilmsView.as_view(), name="film-latest"),
    path("films/<int:film_id>/", FilmDetailAPIView.as_view(), name="film-detail"),
    path("", FilmListAPIView.as_view(), name="film-list"),

    path("persons/<int:pk>/", get_person_by_id),
    path("persons/<int:person_id>/roles/", get_person_roles),

    path("persons/<int:person_id>/available-genres/", films_by_person_views.get_available_genres_by_person_and_role),
    path("persons/<int:person_id>/available-genres/", get_available_genres_by_person_and_role),

]