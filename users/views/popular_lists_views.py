from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from users.models import List
from users.serializers.lists_feed_serializer import ListFeedSerializer
from django.db.models import Count, Q

class PopularListsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        limit = int(request.query_params.get("limit", 5))

        lists = (
            List.objects.filter(active=True, deleted=False)
            .annotate(
                like_count=Count(
                    "listandlikebyuser",
                    filter=Q(listandlikebyuser__active=True, listandlikebyuser__deleted=False)
                )
            )
            .order_by("-like_count", "-date_of_creation")[:limit]
        )

        serializer = ListFeedSerializer(lists, many=True)
        return Response(serializer.data)
