from rest_framework import serializers

from films.serializers.mini_film_serializer import MiniFilmSerializer
from users.models import List, ListAndFilm, ListAndLikeByUser



class ListFeedSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="list_id")
    name = serializers.CharField(source="list_name")
    user = serializers.CharField(source="user.username")
    likes = serializers.SerializerMethodField()
    likedByUser = serializers.SerializerMethodField()  # ✅ NUEVO
    comments = serializers.SerializerMethodField()
    updated = serializers.DateTimeField(source="date_of_creation", format="%Y-%m-%d")
    films = serializers.SerializerMethodField()

    class Meta:
        model = List
        fields = ["id", "name", "user", "likes", "likedByUser", "comments", "updated", "films"]

    def get_likes(self, obj):
        return ListAndLikeByUser.objects.filter(list=obj, active=True, deleted=False).count()

    def get_likedByUser(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False

        return ListAndLikeByUser.objects.filter(
            list=obj,
            user=request.user,
            active=True,
            deleted=False
        ).exists()

    def get_comments(self, obj):
        return 0  # Placeholder

    def get_films(self, obj):
        qs = ListAndFilm.objects.filter(list=obj, active=True, deleted=False).select_related("film")[:5]
        return MiniFilmSerializer([entry.film for entry in qs], many=True).data
