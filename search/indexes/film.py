from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry
from films.models import Film

@registry.register_document
class FilmDocument(Document):
    genres = fields.TextField()
    cast = fields.TextField()
    directors = fields.TextField()

    class Index:
        name = 'films'
        settings = {'number_of_shards': 1, 'number_of_replicas': 0}

    class Django:
        model = Film
        fields = [
            'title',
            'synopsis',
            'release_year',
            'poster_url',
            'popularity',
        ]
        related_models = ['filmandperson_set', 'filmandgenre_set']

    def get_queryset(self):
        return super().get_queryset()

    def prepare_genres(self, instance):
        return [fg.genre.genre_name for fg in instance.filmandgenre_set.all()]

    def prepare_cast(self, instance):
        return [
            fp.person.name
            for fp in instance.filmandperson_set.all()
            if fp.role.name.lower() == "actor"
        ]

    def prepare_directors(self, instance):
        return [
            fp.person.name
            for fp in instance.filmandperson_set.all()
            if fp.role.name.lower() == "director"
        ]
