from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from reviews.models import Review
from users.models import Follower
from reviews.serializers.reviews_feed_serializer import ReviewWithFilmSerializer


class FriendsReviewsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        try:
            limit = int(request.query_params.get("limit", 5))
        except (ValueError, TypeError):
            limit = 5

        followed_ids = Follower.objects.filter(
            follower_user=user,
            active=True,
            deleted=False
        ).values_list("followed_user_id", flat=True)

        reviews = (
            Review.objects
            .filter(
                log__user_id__in=followed_ids,
                active=True,
                deleted=False
            )
            .select_related("log__film", "log__user", "log__rating")
            .order_by("-entry_date")[:limit]
        )

        serializer = ReviewWithFilmSerializer(reviews, many=True)
        return Response(serializer.data)

