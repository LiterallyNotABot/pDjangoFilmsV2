import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from rest_framework.exceptions import PermissionDenied

from .models import ChatRoom, ChatRoomMembership, ChatMessage

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    """WebSocket consumer para chat en tiempo real."""

    async def connect(self):
        self.room_key = self.scope["url_route"]["kwargs"]["room_key"]
        self.room_group_name = f"chat_{self.room_key}"
        user = self.scope["user"]

        if not user.is_authenticated:
            await self.close()
            return

        room = await self._get_room_or_close()
        if room is None:
            return

        has_membership = await self._has_membership(room, user.id)
        if not has_membership:
            await self.close()
            return

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
        print(f" {user.username} connected to {self.room_group_name}")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        print(f" WebSocket connected to {self.room_group_name}")

    async def receive(self, text_data: str):
        data = json.loads(text_data or "{}")
        message = data.get("message", "").strip()
        user = self.scope["user"]

        if not message or not user.is_authenticated:
            return

        chat_msg = await self._save_message(user.id, message)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type":      "chat_message",
                "id":        chat_msg.id,
                "message":   chat_msg.message,
                "timestamp": chat_msg.timestamp.isoformat(),
                "user":      user.username,
            },
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "id":        event["id"],
            "message":   event["message"],
            "timestamp": event["timestamp"],
            "user":      event["user"],
        }))

    @database_sync_to_async
    def _get_room(self):
        return ChatRoom.objects.filter(key=self.room_key).first()

    async def _get_room_or_close(self):
        room = await self._get_room()
        if room is None:
            await self.close()
        return room

    @database_sync_to_async
    def _has_membership(self, room: ChatRoom, user_id: int) -> bool:
        return ChatRoomMembership.objects.filter(
            room=room, user_id=user_id, active=True
        ).exists()

    @database_sync_to_async
    def _save_message(self, user_id: int, message: str) -> ChatMessage:
        room = ChatRoom.objects.get(key=self.room_key)
        return ChatMessage.objects.create(room=room, user_id=user_id, message=message)
