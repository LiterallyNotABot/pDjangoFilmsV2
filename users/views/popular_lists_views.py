from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from users.models import List, ListAndLikeByUser
from users.serializers.lists_feed_serializer import PopularListSerializer
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

        serializer = PopularListSerializer(lists, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
