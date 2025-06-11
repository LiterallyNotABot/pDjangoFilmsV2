from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry
from films.models import Person

@registry.register_document
class PersonDocument(Document):
    name = fields.TextField(fields={"raw": fields.KeywordField()})
    picture_url = fields.TextField()
    relevance_score = fields.FloatField()

    class Index:
        name = 'persons'
        settings = {'number_of_shards': 1, 'number_of_replicas': 0}

    class Django:
        model = Person
        fields = [
            'alias',
            'biography',
            'place_of_birth',
        ]
        related_models = ['filmandperson_set']

    def get_queryset(self):
        return super().get_queryset()

    def prepare_relevance_score(self, instance):
        films = [fp.film for fp in instance.filmandperson_set.all() if fp.film.popularity]
        if not films:
            return 0
        return sum(f.popularity for f in films) / len(films)

    def prepare_picture_url(self, instance):
        return instance.picture_url or ""
