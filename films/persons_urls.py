from django.urls import path
from films.views import films_by_person_views
from films.views.person_views import get_person_roles, get_person_by_id

urlpatterns = [
    path("<int:pk>/", get_person_by_id),
    path("<int:person_id>/roles/", get_person_roles),
    path("<int:person_id>/available-genres/", films_by_person_views.get_available_genres_by_person_and_role),

]