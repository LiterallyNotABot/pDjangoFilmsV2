from django.urls import path

from activity.views.friends_activity_views import FriendsActivityFilmsView
from activity.views.user_film_activity_batch import UserFilmActivityBatchView
from reviews.views.log_film_views import LogFilmView

urlpatterns = [
    path("friends/", FriendsActivityFilmsView.as_view(), name="friends-activity-films"),
    path("user-film-activity/batch/", UserFilmActivityBatchView.as_view(), name="user-film-activity-batch"),

]