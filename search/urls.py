from django.urls import path
from .views.global_search import global_search

urlpatterns = [
    path("", global_search, name="global_search"),
]

