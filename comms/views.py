from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from .models import ChatRoom, ChatRoomMembership, ChatMessage
from .serializers import ChatRoomSerializer, ChatMessageSerializer

class ChatRoomListCreateView(generics.ListCreateAPIView):
    serializer_class = ChatRoomSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Solo chats donde el usuario es miembro activo
        return ChatRoom.objects.filter(memberships__user=self.request.user).distinct()

    def perform_create(self, serializer):
        # Crea la sala y agrega la membresía
        room = serializer.save(created_by=self.request.user)
        ChatRoomMembership.objects.create(room=room, user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("Errores de validación:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class ChatMessagesView(generics.ListAPIView):
    serializer_class = ChatMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # ← ANTES: room = ChatRoom.objects.get(pk=self.kwargs["pk"])
        room = ChatRoom.objects.get(key=self.kwargs["key"])

        if not ChatRoomMembership.objects.filter(room=room, user=self.request.user).exists():
            raise PermissionDenied("No tienes acceso a este chat.")

        return ChatMessage.objects.filter(room=room).order_by("timestamp")


class JoinChatView(APIView):
  permission_classes = [IsAuthenticated]

  def post(self, request):
    key = request.data.get("key")
    try:
      room = ChatRoom.objects.get(key=key, is_closed=False)
    except ChatRoom.DoesNotExist:
      return Response({"detail":"Sala no encontrada"}, status=404)
    # crea membership si no existía activo
    ChatRoomMembership.objects.get_or_create(user=request.user, room=room, defaults={"active":True})
    serializer = ChatRoomSerializer(room)
    return Response(serializer.data)
