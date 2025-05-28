from django.urls import path
from .views.auth_view import LoginView, RegisterView, CurrentUserView
from .views.friends_lists_feed import FriendsListsView
from .views.popular_lists_view import PopularListsView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path("lists/popular/", PopularListsView.as_view(), name="popular-lists"),
    path("lists/friends/", FriendsListsView.as_view(), name="friends-lists"),
    path('me/', CurrentUserView.as_view(), name='me'),
]
