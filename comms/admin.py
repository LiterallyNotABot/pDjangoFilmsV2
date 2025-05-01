from django.contrib import admin

from comms.models import Comment, PrivateConversation, PrivateMessage, CommentAndLikeByUser, ChatRoom, \
    ChatRoomMembership, ChatMessage

admin.site.register(Comment)
admin.site.register(CommentAndLikeByUser)
admin.site.register(PrivateConversation)
admin.site.register(PrivateMessage)
admin.site.register(ChatRoom)
admin.site.register(ChatRoomMembership)
admin.site.register(ChatMessage)