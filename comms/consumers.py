from channels.generic.websocket import AsyncWebsocketConsumer
from .models import ChatRoom, ChatMessage
from django.contrib.auth.models import User
from asgiref.sync import sync_to_async
import json

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_key = self.scope['url_route']['kwargs']['room_key']
        self.room_group_name = f'chat_{self.room_key}'

        # Unirse al grupo
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Salirse del grupo
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        print(f"user: {self.scope['user']} (authenticated: {self.scope['user'].is_authenticated})")
        data = json.loads(text_data)
        message = data['message']
        user = self.scope['user']

        # 👇 Esta parte guarda el mensaje en la base de datos
        await self.save_message(user, self.room_key, message)

        # Enviar mensaje a grupo
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'username': user.username
            }
        )

    async def chat_message(self, event):
        # Enviar mensaje al cliente
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'username': event['username']
        }))

    @sync_to_async
    def save_message(self, user, room_key, message):
        room = ChatRoom.objects.get(key=room_key)
        return ChatMessage.objects.create(room=room, user=user, message=message)
