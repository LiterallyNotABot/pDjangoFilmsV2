import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from django.contrib.auth.models import User
from .models import ChatRoom, ChatMessage, ChatRoomMembership
import logging

logger = logging.getLogger(__name__)


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        logger.debug(">>> CONNECT EJECUTADO")

        self.room_key = self.scope['url_route']['kwargs']['room_key']
        self.room_group_name = f'chat_{self.room_key}'
        user = self.scope["user"]

        logger.debug(
            "Intentando conectar usuario: %s a sala: %s", user.username, self.room_key
        )

        try:
            room = await sync_to_async(ChatRoom.objects.get)(key=self.room_key)
        except ChatRoom.DoesNotExist:
            logger.warning("Sala no existe")
            await self.close()
            return

        membership, created = await sync_to_async(ChatRoomMembership.objects.get_or_create)(
            room=room,
            user=user,
            defaults={'active': True}
        )

        if not created and not membership.active:
            logger.warning("Usuario %s no tiene acceso a la sala.", user.username)
            await self.close()
            return

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        logger.info("%s conectado y unido a %s", user.username, self.room_group_name)
        await self.accept()

    async def disconnect(self, close_code):
        user = self.scope["user"]
        logger.info("%s desconectado de %s", user.username, self.room_group_name)

        try:
            room = await sync_to_async(ChatRoom.objects.get)(key=self.room_key)
            await sync_to_async(ChatRoomMembership.objects.filter(room=room, user=user).update)(active=False)
        except ChatRoom.DoesNotExist:
            pass

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        logger.debug(">>> RECEIVE EJECUTADO")

        data = json.loads(text_data)
        message = data.get('message', '').strip()
        user = self.scope["user"]

        if not message:
            logger.debug("Mensaje vacío ignorado")
            return

        logger.debug("Mensaje recibido de %s: %s", user.username, message)

        await self.save_message(user, self.room_key, message)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'username': user.username
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'username': event['username']
        }))

    @sync_to_async
    def save_message(self, user, room_key, message):
        room = ChatRoom.objects.get(key=room_key)
        logger.debug("Guardando mensaje en sala '%s': %s", room.name, message)
        return ChatMessage.objects.create(room=room, user=user, message=message)
