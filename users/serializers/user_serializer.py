from django.contrib.auth import get_user_model
from rest_framework import serializers
from users.models import Follower

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class PublicUserSerializer(serializers.ModelSerializer):
    display_name = serializers.CharField(source="profile.given_name", default="")
    avatar_url = serializers.SerializerMethodField()
    followers = serializers.SerializerMethodField()
    following = serializers.SerializerMethodField()
    total_films = serializers.SerializerMethodField()
    films_this_year = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "display_name",
            "avatar_url",
            "followers",
            "following",
            "total_films",
            "films_this_year",
        ]

    def get_avatar_url(self, obj):
        if hasattr(obj, "profile") and obj.profile.avatar:
            return obj.profile.avatar.build_url()
        return None

    def get_followers(self, obj):
        return Follower.objects.filter(followed_user=obj).count()

    def get_following(self, obj):
        return Follower.objects.filter(follower_user=obj).count()

    def get_total_films(self, obj):
        from users.models import FilmAndUser
        return (
            FilmAndUser.objects
            .filter(user=obj, watched=True)
            .values("film_id")
            .distinct()
            .count()
        )

    def get_films_this_year(self, obj):
        from reviews.models import Log
        from django.utils.timezone import now
        current_year = now().year
        return (
            Log.objects
            .filter(user=obj, entry_date__year=current_year)
            .values("film_id")
            .distinct()
            .count()
        )
