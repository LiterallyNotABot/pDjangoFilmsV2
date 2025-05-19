import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pDjangoFilmsV2.settings')
django.setup()

from rest_framework_api_key.models import APIKey

api_key, key = APIKey.objects.create_key(name="api_key")
print("Name:", api_key.name)
print("Your API Key:")
print("Api-Key", key)
