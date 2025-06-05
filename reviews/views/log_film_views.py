from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from reviews.models import Log, Review, Rating

class LogFilmView(APIView):
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
        if rating_value is not None:
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

        return Response(
            {"detail": "Log created", "log_id": log.log_id},
            status=status.HTTP_201_CREATED
        )
