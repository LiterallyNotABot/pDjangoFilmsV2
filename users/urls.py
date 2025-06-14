from django.urls import path, include
from .views.auth_view import LoginView, RegisterView, CurrentUserView
from .views.film_and_user_views import FilmUserActivityViewSet
from .views.friends_lists_views import FriendsListsView, ToggleListLikeView
from .views.popular_lists_views import PopularListsView
from .views.watchlist_views import ToggleWatchlistEntryView

film_user_activity = FilmUserActivityViewSet.as_view({
    "get": "retrieve",
    "patch": "partial_update",
    "post": "create",
    "delete": "destroy",
})
urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', CurrentUserView.as_view(), name='me'),
    path("film-activity/<int:film_id>/", film_user_activity, name="film-user-activity"),
    path("film-activity/<int:film_id>/watchlist/", ToggleWatchlistEntryView.as_view(), name="toggle-watchlist"),

    path('lists/', include([
    path('popular/', PopularListsView.as_view(), name='popular-lists'),
    path('friends/', FriendsListsView.as_view(), name='friends-lists'),
    path("<int:list_id>/like-toggle/", ToggleListLikeView.as_view(), name="toggle-list-like"),
    ])),
]
