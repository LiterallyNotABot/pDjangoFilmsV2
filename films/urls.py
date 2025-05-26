# films/urls.py
from django.urls import path
from .views.films_views import FilmListAPIView, FilmDetailAPIView, LatestFilmsView
from .views.friends_activity_view import FriendsActivityFilmsView

urlpatterns = [
    path("", FilmListAPIView.as_view(), name="film-list"),
    path("<int:film_id>/", FilmDetailAPIView.as_view(), name="film-detail"),
    path("latest/", LatestFilmsView.as_view(), name="film-latest"),
    path("friends-activity/", FriendsActivityFilmsView.as_view(), name="friends-activity-films"),
]