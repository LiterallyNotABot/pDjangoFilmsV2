from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import AllowAny

from users.models import List
from users.serializers.list_serializer import ListSerializer

class UserListsViewSet(viewsets.ModelViewSet):
    serializer_class = ListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        username = self.kwargs.get("username")
        return List.objects.filter(user__username=username)

    def perform_create(self, serializer):
        username = self.kwargs.get("username")
        if self.request.user.username != username:
            raise PermissionDenied("You cannot create a list for another user.")
        serializer.save(user=self.request.user)

class PublicListDetailView(RetrieveAPIView):
    queryset = List.objects.filter(active=True, deleted=False)
    serializer_class = ListSerializer
    permission_classes = [AllowAny]
    lookup_field = 'list_id'