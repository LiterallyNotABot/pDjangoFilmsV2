from django.urls import path
from reviews.views.friends_reviews_view import FriendsReviewsView
from reviews.views.log_film_views import LogFilmView
from reviews.views.popular_reviews_view import PopularReviewsView

urlpatterns = [
    path("popular/", PopularReviewsView.as_view(), name="popular-reviews"),
    path("friends/", FriendsReviewsView.as_view(), name="friends-reviews"),
    path("log/", LogFilmView.as_view(), name="activity-log"),

]
