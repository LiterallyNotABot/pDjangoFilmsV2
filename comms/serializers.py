from rest_framework import serializers
from .models import ChatRoom, ChatMessage

class ChatRoomSerializer(serializers.ModelSerializer):
    key = serializers.CharField(required=False)

    class Meta:
        model = ChatRoom
        fields = ['id', 'key', 'name', 'created_at']

class ChatMessageSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = ChatMessage
        fields = ['id', 'room', 'user', 'message', 'timestamp']
