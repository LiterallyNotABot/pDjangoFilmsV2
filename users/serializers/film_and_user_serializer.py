from rest_framework import serializers
from users.models import FilmAndUser
from reviews.models import Rating


class RatingField(serializers.Field):
    default_error_messages = {
        'invalid': 'Invalid rating value.'
    }

    def __init__(self, **kwargs):
        kwargs['required'] = False
        kwargs['allow_null'] = True
        super().__init__(**kwargs)

    def to_representation(self, obj):
        return obj.rating_value if obj else None

    def to_internal_value(self, data):
        if data is None:
            return None
        try:
            return Rating.objects.get(rating_value=data)
        except Rating.DoesNotExist:
            self.fail('invalid')



class FilmAndUserSerializer(serializers.ModelSerializer):
    rating = RatingField()

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

    def update(self, instance, validated_data):
        for attr in ["liked", "watched"]:
            if attr in validated_data:
                setattr(instance, attr, validated_data[attr])

        # Asegurar que rating se actualice incluso si es None
        if "rating" in self.initial_data:
            instance.rating = validated_data.get("rating", None)

        instance.save()
        return instance

