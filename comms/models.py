from django.db import models
from django.contrib.auth import get_user_model

from films.models import Film

User = get_user_model()

class Comment(models.Model):
    comment_id = models.AutoField(primary_key=True, verbose_name="Comment ID")
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="User")
    film = models.ForeignKey(Film, on_delete=models.CASCADE, verbose_name="Film")
    parent_comment = models.ForeignKey('self', on_delete=models.CASCADE, blank=True, null=True, verbose_name="Parent Comment")
    body = models.TextField(verbose_name="Comment Body")
    creation_date = models.DateTimeField(verbose_name="Creation Date")
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        managed = True
        db_table = 'comments'
        verbose_name = "Comment"
        verbose_name_plural = "Comments"


class CommentAndLikeByUser(models.Model):
    like_id = models.AutoField(primary_key=True, verbose_name="Like ID")
    comment = models.ForeignKey(Comment, on_delete=models.DO_NOTHING, verbose_name="Comment")
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING, verbose_name="User")
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        managed = True
        db_table = 'commentsandlikesbyuser'
        verbose_name = "Comment and Like by User"
        verbose_name_plural = "Comments and Likes by Users"

        

class PrivateConversation(models.Model):
    conversation_id = models.AutoField(primary_key=True, verbose_name="Conversation ID")
    creator = models.ForeignKey(User, on_delete=models.DO_NOTHING, verbose_name="Creator")
    target = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name='private_conversation_target_set', verbose_name="Target User")
    subject = models.CharField(max_length=255, blank=True, null=True, verbose_name="Subject")
    date_created = models.DateTimeField(verbose_name="Date Created")
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        managed = True
        db_table = 'privateconversation'
        verbose_name = "Private Conversation"
        verbose_name_plural = "Private Conversations"

        


class PrivateMessage(models.Model):
    message_id = models.AutoField(primary_key=True, verbose_name="Message ID")
    conversation = models.ForeignKey(PrivateConversation, on_delete=models.DO_NOTHING, verbose_name="Conversation")
    sender = models.ForeignKey(User, on_delete=models.DO_NOTHING, verbose_name="Sender")
    content = models.TextField(verbose_name="Message Content")
    date_sent = models.DateTimeField(verbose_name="Date Sent")
    read_status = models.BooleanField(default=False, verbose_name="Read Status")
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        managed = True
        db_table = 'privatemessages'
        verbose_name = "Private Message"
        verbose_name_plural = "Private Messages"


class ChatRoom(models.Model):
    name = models.CharField(max_length=100)
    key = models.CharField(max_length=32, unique=True, verbose_name="Room Key")
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_rooms')
    created_at = models.DateTimeField(auto_now_add=True)
    is_closed = models.BooleanField(default=False, verbose_name="Is Closed?")
    closed_at = models.DateTimeField(null=True, blank=True, verbose_name="Closed At")
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        db_table = 'ChatRooms'
        verbose_name = 'Chat Room'
        verbose_name_plural = 'Chat Rooms'

    def __str__(self):
        return f"{self.name} ({self.key})"

class ChatRoomMembership(models.Model):
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='memberships')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    joined_at = models.DateTimeField(auto_now_add=True)
    abandoned_at = models.DateTimeField(null=True, blank=True)
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        db_table = 'ChatRoomMemberships'
        verbose_name = 'Chat Room Membership'
        verbose_name_plural = 'Chat Room Memberships'
        ordering = ['-joined_at']
        indexes = [
            models.Index(fields=['room', 'user']),
        ]

    def __str__(self):
        return f"{self.user} in {self.room} @ {self.joined_at}"


class ChatMessage(models.Model):
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        db_table = 'ChatMessages'
        verbose_name = 'Chat Message'
        verbose_name_plural = 'Chat Messages'
        ordering = ['timestamp']

    def __str__(self):
        return f"{self.user}: {self.message[:30]}"
