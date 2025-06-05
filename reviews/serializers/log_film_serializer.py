from rest_framework import serializers
from films.models import Film
from reviews.models import Rating

class LogFilmSerializer(serializers.Serializer):
    filmId = serializers.IntegerField()
    liked = serializers.BooleanField(default=False)
    rating = serializers.DecimalField(required=False, max_digits=2, decimal_places=1)
    review = serializers.CharField(required=False, allow_blank=True)

    def validate_filmId(self, value):
        try:
            return Film.objects.get(pk=value)
        except Film.DoesNotExist:
            raise serializers.ValidationError("Film not found.")

    def validate_rating(self, value):
        if value is None:
            return None
        try:
            return Rating.objects.get(rating_value=value)
        except Rating.DoesNotExist:
            raise serializers.ValidationError("Invalid rating value.")
