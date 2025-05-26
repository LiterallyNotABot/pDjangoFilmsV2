from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from reviews.models import Review
from reviews.serializers.reviews_feed_serializer import ReviewWithFilmSerializer
from django.db.models import Count, Q

class PopularReviewsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            limit = int(request.query_params.get("limit", 5))
        except (ValueError, TypeError):
            limit = 5

        reviews = (
            Review.objects.filter(active=True, deleted=False)
            .annotate(
                like_count=Count(
                    "log__reviewandlikebyuser",
                    filter=Q(log__reviewandlikebyuser__active=True, log__reviewandlikebyuser__deleted=False)
                )
            )
            .order_by("-like_count", "-log__entry_date")[:limit]
        )

        serializer = ReviewWithFilmSerializer(reviews, many=True)
        return Response(serializer.data)
