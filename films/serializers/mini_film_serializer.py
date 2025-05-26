from rest_framework import serializers
from films.models import Film

class MiniFilmSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="film_id")
    year = serializers.IntegerField(source="release_year")
    posterUrl = serializers.CharField(source="poster_url")
    backdropUrl = serializers.CharField(source="backdrop_url")

    class Meta:
        model = Film
        fields = ["id", "title", "year", "posterUrl", "backdropUrl"]

