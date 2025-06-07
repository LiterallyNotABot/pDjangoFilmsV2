from django_elasticsearch_dsl import Document
from django_elasticsearch_dsl.registries import registry
from films.models import Person

@registry.register_document
class PersonDocument(Document):
    class Index:
        name = 'persons'
        settings = {'number_of_shards': 1, 'number_of_replicas': 0}

    class Django:
        model = Person
        fields = [
            'name',
            'alias',
            'biography',
            'place_of_birth',
        ]

    def get_queryset(self):
        return super().get_queryset()
