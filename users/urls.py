from django.urls import path, include
from .views.auth_view import LoginView, RegisterView, CurrentUserView
from .views.friends_lists_views import FriendsListsView
from .views.popular_lists_views import PopularListsView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', CurrentUserView.as_view(), name='me'),

    path('lists/', include([
        path('popular/', PopularListsView.as_view(), name='popular-lists'),
        path('friends/', FriendsListsView.as_view(), name='friends-lists'),
    ])),
]
