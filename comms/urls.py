from django.urls import path
from . import views

urlpatterns = [
    path('test-chat/<str:room_key>/', views.test_chat_view, name='test_chat'),
]