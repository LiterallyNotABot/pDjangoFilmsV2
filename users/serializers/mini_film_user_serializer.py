from rest_framework import serializers
from users.models import FilmAndUser

class UserFilmActivityMiniSerializer(serializers.ModelSerializer):
    film_id = serializers.IntegerField(source="film.film_id")

    class Meta:
        model = FilmAndUser
        fields = ["film_id", "liked", "watched", "rating"]
