from django.urls import path

from activity.views.friends_activity_views import FriendsActivityFilmsView

urlpatterns = [
    path("friends/", FriendsActivityFilmsView.as_view(), name="friends-activity-films"),
]