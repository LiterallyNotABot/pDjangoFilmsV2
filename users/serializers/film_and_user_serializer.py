from rest_framework import serializers
from users.models import FilmAndUser
from reviews.models import Rating


class FilmAndUserSerializer(serializers.ModelSerializer):
    rating = serializers.SerializerMethodField()

    class Meta:
        model = FilmAndUser
        fields = [
            "film_and_user_id",
            "film",
            "user",
            "watched",
            "liked",
            "rating",
        ]
        read_only_fields = ["film_and_user_id", "user"]

    def get_rating(self, obj):
        return obj.rating.rating_value if obj.rating else None

    def validate(self, data):
        raw_data = self.initial_data
        rating_val = raw_data.get("rating", None)

        if rating_val is None:
            data["rating"] = None
        else:
            try:
                data["rating"] = Rating.objects.get(rating_value=rating_val)
            except Rating.DoesNotExist:
                raise serializers.ValidationError({
                    "rating": f"No Rating with value {rating_val}"
                })

        return data

    def update(self, instance, validated_data):
        instance.liked = validated_data.get("liked", instance.liked)
        instance.watched = validated_data.get("watched", instance.watched)

        if "rating" in validated_data:
            instance.rating = validated_data["rating"]

        instance.save()
        return instance
