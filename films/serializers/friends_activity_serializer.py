from rest_framework import serializers
from films.models import Film
from reviews.models import Log

class FriendUserActivitySerializer(serializers.Serializer):
    username = serializers.CharField()
    liked = serializers.BooleanField()
    rating = serializers.FloatField(allow_null=True)
    reviewed = serializers.BooleanField()

class FriendsActivityFilmSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    title = serializers.CharField()
    year = serializers.IntegerField(allow_null=True)
    posterUrl = serializers.CharField(allow_blank=True, allow_null=True)
    backdropUrl = serializers.CharField(allow_blank=True, allow_null=True)
    user = FriendUserActivitySerializer()

