from rest_framework import serializers
from users.models import List, ListAndFilm, ListAndLikeByUser

class ListFilmPreviewSerializer(serializers.Serializer):
    id = serializers.IntegerField(source="film.film_id")
    title = serializers.CharField(source="film.title")
    posterUrl = serializers.CharField(source="film.poster_url")
    backdropUrl = serializers.CharField(source="film.backdrop_url", allow_null=True)


class PopularListSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="list_id")
    name = serializers.CharField(source="list_name")
    user = serializers.CharField(source="user.username")
    likes = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()
    updated = serializers.DateTimeField(source="date_of_creation", format="%Y-%m-%d")
    films = serializers.SerializerMethodField()

    class Meta:
        model = List
        fields = ["id", "name", "user", "likes", "comments", "updated", "films"]

    def get_likes(self, obj):
        return ListAndLikeByUser.objects.filter(list=obj, active=True, deleted=False).count()

    def get_comments(self, obj):
        return 0  # Placeholder

    def get_films(self, obj):
        qs = ListAndFilm.objects.filter(list=obj, active=True, deleted=False).select_related("film")[:5]
        return ListFilmPreviewSerializer(qs, many=True).data
