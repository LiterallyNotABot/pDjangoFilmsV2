from django.shortcuts import render
from .models import ChatRoom

def test_chat_view(request, room_key):
    room = ChatRoom.objects.get(key=room_key)
    return render(request, 'comms/test_chat.html', {'room': room})
