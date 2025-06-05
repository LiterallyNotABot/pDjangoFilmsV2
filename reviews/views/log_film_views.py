from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.test import RequestFactory
from django.urls import resolve
from reviews.models import Log, Review, Rating
from users.views.film_and_user_views import FilmUserActivityViewSet
from users.views.watchlist_views import ToggleWatchlistEntryView

class CreateLogAndReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        data = request.data

        film_id = data.get("filmId")
        rating_value = data.get("rating")
        liked = data.get("liked", False)
        review_text = data.get("review", "").strip()

        if not film_id:
            return Response({"detail": "Film ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        rating_obj = None
        if rating_value:
            rating_obj, _ = Rating.objects.get_or_create(rating_value=rating_value)

        log = Log.objects.create(
            film_id=film_id,
            user=user,
            liked=liked,
            rating=rating_obj
        )

        if review_text:
            Review.objects.create(
                log=log,
                body=review_text
            )

        factory = RequestFactory()
        patch_request = factory.patch(
            f"/users/film-activity/{film_id}/",
            {
                "watched": True,
                "liked": liked,
                "rating": rating_obj.rating_id if rating_obj else None,
            },
            content_type="application/json"
        )
        patch_request.user = user
        patch_response = FilmUserActivityViewSet.as_view({"patch": "partial_update"})(patch_request, film_id=film_id)

        delete_request = factory.delete(f"/users/film-activity/{film_id}/watchlist/")
        delete_request.user = user
        _ = ToggleWatchlistEntryView.as_view()(delete_request, film_id=film_id)

        return Response(
            {"detail": "Log created", "log_id": log.log_id},
            status=status.HTTP_201_CREATED
        )
