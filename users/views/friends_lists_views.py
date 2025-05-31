from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.models import List, Follower
from users.serializers.lists_feed_serializer import PopularListSerializer

class FriendsListsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        limit = int(request.query_params.get("limit", 5))

        followed_ids = Follower.objects.filter(
            follower_user=user,
            active=True,
            deleted=False
        ).values_list("followed_user_id", flat=True)

        lists = (
            List.objects.filter(
                user_id__in=followed_ids,
                active=True,
                deleted=False
            )
            .order_by("-date_of_creation")[:limit]
        )

        serializer = PopularListSerializer(lists, many=True)
        return Response(serializer.data)
