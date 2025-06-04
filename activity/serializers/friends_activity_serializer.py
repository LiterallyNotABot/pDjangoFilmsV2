from rest_framework import serializers
from films.models import Film
from reviews.models import Log
from rest_framework import serializers

class FriendsActivityFilmSerializer(serializers.Serializer):
    id = serializers.IntegerField(source="film.film_id")
    title = serializers.CharField(source="film.title")
    year = serializers.IntegerField(source="film.release_year", allow_null=True)
    posterUrl = serializers.CharField(source="film.poster_url", allow_blank=True, allow_null=True)
    backdropUrl = serializers.CharField(source="film.backdrop_url", allow_blank=True, allow_null=True)
    user = serializers.SerializerMethodField()

    def get_user(self, log):
        review_exists = getattr(log, "has_review", False)
        return {
            "username": log.user.username,
            "liked": log.liked,
            "rating": float(log.rating.rating_value) if log.rating else None,
            "reviewed": review_exists
        }

