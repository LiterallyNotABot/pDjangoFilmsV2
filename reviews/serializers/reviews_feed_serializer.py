from rest_framework import serializers
from films.serializers.mini_film_serializer import MiniFilmSerializer
from reviews.models import Review, ReviewAndLikeByUser
from users.models import FilmAndUser


class ReviewWithFilmSerializer(serializers.ModelSerializer):
    film = serializers.SerializerMethodField()
    author = serializers.SerializerMethodField()
    date = serializers.DateTimeField(source="log.entry_date", format="%Y-%m-%d")
    likes = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()
    likedByUser = serializers.SerializerMethodField()

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
            "likedByUser",
        ]

    def get_film(self, obj):
        film_data = MiniFilmSerializer(obj.log.film).data
        request = self.context.get("request")

        # Agrega estado del usuario si está autenticado
        if request and request.user.is_authenticated:
            try:
                film_user = FilmAndUser.objects.get(user=request.user, film=obj.log.film)
                film_data.update({
                    "liked": film_user.liked,
                    "watched": film_user.watched,
                    "reviewed": getattr(film_user, "reviewed", False),
                    "watchlisted": getattr(film_user, "watchlisted", False),
                })
            except FilmAndUser.DoesNotExist:
                film_data.update({
                    "liked": False,
                    "watched": False,
                    "reviewed": False,
                    "watchlisted": False,
                })

        return film_data

    def get_author(self, obj):
        user = obj.log.user
        profile = getattr(user, "profile", None)
        return {
            "username": user.username,
            "avatarUrl": profile.avatar.url if profile and profile.avatar else None,
        }

    def get_rating(self, obj):
        return float(obj.log.rating.rating_value) if obj.log.rating else None

    def get_likes(self, obj):
        return ReviewAndLikeByUser.objects.filter(
            log=obj.log,
            active=True,
            deleted=False
        ).count()

    def get_likedByUser(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False
        return ReviewAndLikeByUser.objects.filter(
            log=obj.log,
            user=request.user,
            active=True,
            deleted=False
        ).exists()
