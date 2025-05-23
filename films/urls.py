# films/urls.py
from django.urls import path
from .views.films_views import FilmListAPIView, FilmDetailAPIView

urlpatterns = [
    path("", FilmListAPIView.as_view(), name="film-list"),
    path("<int:film_id>/", FilmDetailAPIView.as_view(), name="film-detail"),
]