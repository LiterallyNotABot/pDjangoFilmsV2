from django.contrib import admin

from comms.models import Comment, PrivateConversation, PrivateMessage, CommentAndLikeByUser

admin.site.register(Comment)
admin.site.register(CommentAndLikeByUser)
admin.site.register(PrivateConversation)
admin.site.register(PrivateMessage)