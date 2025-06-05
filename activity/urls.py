from django.urls import path

from activity.views.friends_activity_views import FriendsActivityFilmsView
from reviews.views.log_film_views import LogFilmView

urlpatterns = [
    path("friends/", FriendsActivityFilmsView.as_view(), name="friends-activity-films"),
]