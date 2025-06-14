from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.models import List, Follower, ListAndLikeByUser
from users.serializers.lists_feed_serializer import ListFeedSerializer

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

        serializer = ListFeedSerializer(lists, many=True, context={"request": request})
        return Response(serializer.data)


class ToggleListLikeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, list_id):
        user = request.user

        try:
            lst = List.objects.get(list_id=list_id, active=True, deleted=False)
        except List.DoesNotExist:
            return Response({"detail": "List not found."}, status=404)

        obj, created = ListAndLikeByUser.objects.get_or_create(
            user=user,
            list=lst,
            defaults={"active": True}
        )

        if not created:
            obj.active = not obj.active
            obj.save()

        return Response({
            "liked": obj.active
        })

