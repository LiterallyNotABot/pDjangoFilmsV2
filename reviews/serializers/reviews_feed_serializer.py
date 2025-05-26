from rest_framework import serializers
from reviews.models import Review, ReviewAndLikeByUser
from films.serializers.mini_film_serializer import MiniFilmSerializer

class ReviewWithFilmSerializer(serializers.ModelSerializer):
    film = serializers.SerializerMethodField()
    author = serializers.SerializerMethodField()
    date = serializers.DateTimeField(source="log.entry_date", format="%Y-%m-%d")
    likes = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = [
            "review_id",
            "film",
            "author",
            "date",
            "body",
            "rating",
            "likes",
        ]

    def get_film(self, obj):
        return MiniFilmSerializer(obj.log.film).data

    def get_author(self, obj):
        return obj.log.user.username

    def get_rating(self, obj):
        return float(obj.log.rating.rating_value) if obj.log.rating else None

    def get_likes(self, obj):
        return ReviewAndLikeByUser.objects.filter(
            log=obj.log, active=True, deleted=False
        ).count()
