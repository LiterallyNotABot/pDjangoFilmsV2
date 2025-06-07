from django_elasticsearch_dsl import Document
from django_elasticsearch_dsl.registries import registry
from users.models import List

@registry.register_document
class ListDocument(Document):
    class Index:
        name = 'lists'
        settings = {'number_of_shards': 1, 'number_of_replicas': 0}

    class Django:
        model = List
        fields = [
            'list_name',
            'list_description',
        ]
        related_models = ['user']

    def get_queryset(self):
        return super().get_queryset().select_related('user')

    def prepare_username(self, instance):
        return instance.user.username
