from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from reviews.models import Review, ReviewAndLikeByUser
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

        serializer = ReviewWithFilmSerializer(reviews, many=True, context={"request": request})
        return Response(serializer.data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def toggle_review_like(request, review_id):
    review = get_object_or_404(Review, pk=review_id)

    like_obj, created = ReviewAndLikeByUser.objects.get_or_create(
        log=review.log,
        user=request.user,
        defaults={"active": True, "deleted": False}
    )

    if not created:
        like_obj.active = not like_obj.active
        like_obj.deleted = not like_obj.active
        like_obj.save()

    return Response({"liked": like_obj.active})
