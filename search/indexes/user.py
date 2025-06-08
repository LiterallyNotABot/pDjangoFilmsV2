from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry
from django.contrib.auth import get_user_model
from users.models import UserProfile

User = get_user_model()

@registry.register_document
class UserDocument(Document):
    avatar = fields.TextField()

    class Index:
        name = 'users'
        settings = {'number_of_shards': 1, 'number_of_replicas': 0}

    class Django:
        model = UserProfile
        fields = [
            'bio',
            'location',
            'given_name',
        ]
        related_models = [User]

    def get_queryset(self):
        return super().get_queryset()

    def prepare_username(self, instance):
        return instance.user.username

    def prepare_email(self, instance):
        return instance.user.email

    def prepare_avatar(self, instance):
        return str(instance.avatar) if instance.avatar else ""
