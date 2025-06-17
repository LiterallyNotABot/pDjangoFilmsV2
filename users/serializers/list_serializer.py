from rest_framework import serializers
from users.models import List, ListAndFilm
from films.models import Film
from films.serializers.mini_film_serializer import MiniFilmSerializer

class ListSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='list_id', read_only=True)
    name = serializers.CharField(source='list_name')
    description = serializers.CharField(source='list_description', allow_blank=True, required=False)
    date_of_creation = serializers.DateTimeField(read_only=True)

    films = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False,
        allow_empty=True
    )

    film_details = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = List
        fields = ['id', 'name', 'description', 'date_of_creation', 'films', 'film_details']

    def create(self, validated_data):
        film_ids = validated_data.pop('films', [])
        instance = super().create(validated_data)
        self._associate_films(instance, film_ids)
        return instance

    def update(self, instance, validated_data):
        film_ids = validated_data.pop('films', None)
        instance = super().update(instance, validated_data)
        if film_ids is not None:
            ListAndFilm.objects.filter(list=instance).delete()
            self._associate_films(instance, film_ids)
        return instance

    def _associate_films(self, list_instance, film_ids):
        valid_ids = Film.objects.filter(film_id__in=film_ids).values_list('film_id', flat=True)
        for idx, film_id in enumerate(valid_ids):
            ListAndFilm.objects.create(
                list=list_instance,
                film_id=film_id,
                sort_order=idx
            )

    def get_film_details(self, obj):
        film_ids = (
            ListAndFilm.objects
            .filter(list=obj)
            .order_by('sort_order')
            .values_list('film_id', flat=True)
        )
        films = Film.objects.filter(film_id__in=film_ids)
        return MiniFilmSerializer(films, many=True).data
