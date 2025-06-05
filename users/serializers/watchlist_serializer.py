from rest_framework import serializers
from users.models import Watchlist

class WatchlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Watchlist
        fields = ['entry_id', 'film', 'user', 'date_added']
        read_only_fields = ['entry_id', 'date_added', 'user']
