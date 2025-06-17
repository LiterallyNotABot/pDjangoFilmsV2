from django.urls import path
from users.views.auth_view import LoginView, RegisterView, CurrentUserView
from users.views.dashboard_views import (
    UserRatingStatsView, UserReviewsView, UserRecentActivityView,
    UserWatchlistView, UserFavoriteFilmsView, UserProfileView,
    UserDashboardDataView, get_user_diary
)
from users.views.film_and_user_views import (
    FilmUserActivityViewSet, get_user_films, get_user_watchlist
)
from users.views.friends_lists_views import FriendsListsView, ToggleListLikeView
from users.views.popular_lists_views import PopularListsView
from users.views.watchlist_views import ToggleWatchlistEntryView
from users.views.lists_views import UserListsViewSet, PublicListDetailView

film_user_activity = FilmUserActivityViewSet.as_view({
    "get": "retrieve",
    "patch": "partial_update",
    "post": "create",
    "delete": "destroy",
})

user_lists = UserListsViewSet.as_view({
    'get': 'list',
    'post': 'create',
})

user_list_detail = UserListsViewSet.as_view({
    'get': 'retrieve',
    'patch': 'partial_update',
    'delete': 'destroy',
})

urlpatterns = [
    # Auth
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', CurrentUserView.as_view(), name='me'),

    # Film activity
    path("film-activity/<int:film_id>/", film_user_activity, name="film-user-activity"),
    path("film-activity/<int:film_id>/watchlist/", ToggleWatchlistEntryView.as_view(), name="toggle-watchlist"),

    path("<str:username>/profile/", UserProfileView.as_view(), name="user-profile"),
    path("<str:username>/favorites/", UserFavoriteFilmsView.as_view(), name="user-favorites"),
    path("<str:username>/watchlist/", UserWatchlistView.as_view(), name="user-watchlist"),
    path("<str:username>/activity/", UserRecentActivityView.as_view(), name="user-activity"),
    path("<str:username>/reviews/", UserReviewsView.as_view(), name="user-reviews"),
    path("<str:username>/stats/", UserRatingStatsView.as_view(), name="user-stats"),
    path("<str:username>/dashboard/", UserDashboardDataView.as_view(), name="user-dashboard"),
    path("<str:username>/films/", get_user_films, name="user-films"),
    path("<str:username>/watchlist/films/", get_user_watchlist, name="user-watchlist-films"),
    path("<str:username>/diary/", get_user_diary, name="user-diary"),

    path("<str:username>/lists/", user_lists, name="user-lists"),  # GET list / POST create
    path("<str:username>/lists/<int:pk>/", user_list_detail, name="user-list-detail"),  # GET/UPDATE/DELETE individual list

    path("lists/<int:list_id>/", PublicListDetailView.as_view(), name="public-list-detail"),
    path("lists/popular/", PopularListsView.as_view(), name="popular-lists"),
    path("lists/friends/", FriendsListsView.as_view(), name="friends-lists"),
    path("lists/<int:list_id>/like-toggle/", ToggleListLikeView.as_view(), name="toggle-list-like"),
]
