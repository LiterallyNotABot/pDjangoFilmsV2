from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
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
        watched_date_str = data.get("watched_date")

        if not film_id:
            return Response({"detail": "Film ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        watched_date = None
        if watched_date_str:
            try:
                watched_date = datetime.strptime(watched_date_str, "%Y-%m-%d")
            except ValueError:
                return Response(
                    {"detail": "Invalid date format. Expected YYYY-MM-DD."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        rating_obj = None
        if rating_value is not None:
            rating_obj, _ = Rating.objects.get_or_create(rating_value=rating_value)

        log = Log.objects.create(
            film_id=film_id,
            user=user,
            liked=liked,
            rating=rating_obj
        )

        if watched_date:
            log.entry_date = watched_date
            log.save(update_fields=["entry_date"])

        if review_text:
            Review.objects.create(
                log=log,
                body=review_text,
                entry_date=log.entry_date
            )

        return Response(
            {"detail": "Log created", "log_id": log.log_id},
            status=status.HTTP_201_CREATED
        )

class LogDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, log_id):
        log = get_object_or_404(Log, pk=log_id, user=request.user)
        data = request.data

        rating_value = data.get("rating")
        liked = data.get("liked", False)
        review_text = data.get("review", "").strip()
        watched_date = data.get("watched_date")

        if watched_date:
            try:
                log.entry_date = datetime.strptime(watched_date, "%Y-%m-%d")
            except ValueError:
                return Response({"detail": "Invalid date format"}, status=400)

        if rating_value is not None:
            rating_obj, _ = Rating.objects.get_or_create(rating_value=rating_value)
            log.rating = rating_obj
        else:
            log.rating = None

        log.liked = liked
        log.save()

        # Update or create review
        if review_text:
            Review.objects.update_or_create(
                log=log,
                defaults={
                    "body": review_text,
                    "entry_date": log.entry_date,
                },
            )
        else:
            Review.objects.filter(log=log).delete()

        return Response({"detail": "Log updated"})

    def delete(self, request, log_id):
        log = get_object_or_404(Log, pk=log_id, user=request.user)
        log.delete()
        return Response({"detail": "Log deleted"}, status=204)