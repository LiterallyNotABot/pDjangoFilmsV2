import json

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model

from .models import ChatRoom, ChatRoomMembership, ChatMessage

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    """WebSocket consumer para chat en tiempo real."""

    # ------------------------------------------------------------------
    # Conexión
    # ------------------------------------------------------------------
    async def connect(self):
        # Clave de la sala tomada del path ws/chat/<room_key>/
        self.room_key: str = self.scope["url_route"]["kwargs"]["room_key"]
        self.room_group_name: str = f"chat_{self.room_key}"

        user = self.scope["user"]
        if not user.is_authenticated:
            await self.close()
            return

        user_id = user.id  # ⚠️ Convierte UserLazyObject → int

        # Comprueba que la sala existe
        room = await self._get_room_or_close()
        if room is None:
            return

        # Crea / activa la membresía
        await self._ensure_membership(room, user_id)

        # Une el canal al grupo y acepta el WebSocket
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
        print(f"🟢 {user.username} conectado a {self.room_group_name}")

    # ------------------------------------------------------------------
    # Desconexión
    # ------------------------------------------------------------------
    async def disconnect(self, close_code):
        user = self.scope["user"]
        if user.is_authenticated:
            await self._deactivate_membership(user.id)
            print(f"🔴 {user.username} salió de {self.room_group_name}")

        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # ------------------------------------------------------------------
    # Recepción de mensajes
    # ------------------------------------------------------------------
    async def receive(self, text_data: str):
        data = json.loads(text_data or "{}")
        message: str = data.get("message", "").strip()
        user = self.scope["user"]

        if not message or not user.is_authenticated:
            return  # Ignora mensajes vacíos o sin auth

        # Guarda el mensaje
        await self._save_message(user.id, message)

        # Reenvía al grupo
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                "username": user.username,
            },
        )

    # ------------------------------------------------------------------
    # Envío a los clientes
    # ------------------------------------------------------------------
    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "username": event["username"],
        }))

    # ------------------------------------------------------------------
    # Helpers síncronos envueltos
    # ------------------------------------------------------------------
    @database_sync_to_async
    def _get_room(self):
        return ChatRoom.objects.filter(key=self.room_key).first()

    async def _get_room_or_close(self):
        room = await self._get_room()
        if room is None:
            await self.close()
        return room

    @database_sync_to_async
    def _ensure_membership(self, room: ChatRoom, user_id: int):
        membership, created = ChatRoomMembership.objects.get_or_create(
            room=room,
            user_id=user_id,
            defaults={"active": True},
        )
        if not created and not membership.active:
            membership.active = True
            membership.save(update_fields=["active"])

    @database_sync_to_async
    def _deactivate_membership(self, user_id: int):
        ChatRoomMembership.objects.filter(
            room__key=self.room_key, user_id=user_id, active=True
        ).update(active=False)

    @database_sync_to_async
    def _save_message(self, user_id: int, message: str):
        room = ChatRoom.objects.get(key=self.room_key)
        return ChatMessage.objects.create(room=room, user_id=user_id, message=message)
