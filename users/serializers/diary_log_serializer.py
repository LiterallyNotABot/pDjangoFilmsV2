from rest_framework import serializers
from films.serializers.mini_film_serializer import MiniFilmSerializer
from reviews.models import Log, Review


class DiaryLogSerializer(serializers.ModelSerializer):
    film = MiniFilmSerializer()
    date = serializers.DateTimeField(source="entry_date", format="%Y-%m-%d")
    rating = serializers.SerializerMethodField()
    reviewed = serializers.SerializerMethodField()
    review = serializers.SerializerMethodField()

    class Meta:
        model = Log
        fields = ["log_id", "film", "date", "rating", "liked", "reviewed", "review"]

    def get_rating(self, obj):
        return float(obj.rating.rating_value) if obj.rating else None

    def get_reviewed(self, obj):
        return Review.objects.filter(log=obj).exists()

    def get_review(self, obj):
        review = Review.objects.filter(log=obj).first()
        if review and review.body.strip():
            return {
                "body": review.body,
                "entry_date": review.entry_date.strftime("%Y-%m-%d")
            }
        return None
