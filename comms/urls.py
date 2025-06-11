from django.urls import path
from .views import ChatRoomListCreateView, ChatMessagesView, JoinChatView, LeaveChatView

urlpatterns = [
    path("chats/", ChatRoomListCreateView.as_view(), name="chatroom-list"),
    path("chats/<slug:key>/messages/", ChatMessagesView.as_view(), name="chat-messages"),
    path("chats/join/", JoinChatView.as_view(), name="join-chat"),
    path("chats/<slug:key>/leave/", LeaveChatView.as_view(), name="leave-chat"),

]