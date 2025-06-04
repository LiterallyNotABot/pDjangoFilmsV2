# activity/views/friends_activity_views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, Exists, OuterRef
from activity.serializers.friends_activity_serializer import FriendsActivityFilmSerializer
from films.models import Film
from reviews.models import Log, Review
from users.models import Follower
from films.serializers.mini_film_serializer import MiniFilmSerializer


class FriendsActivityFilmsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        limit = int(request.query_params.get("limit", 10))

        followed_ids = Follower.objects.filter(
            follower_user=user
        ).values_list("followed_user_id", flat=True)

        if not followed_ids:
            films = Film.objects.order_by("-film_id")[:limit]
            serializer = MiniFilmSerializer(films, many=True)
            return Response(serializer.data)

        recent_logs = (
            Log.objects
            .filter(user_id__in=followed_ids)
            .filter(Q(liked=True) | Q(rating__isnull=False) | Q(review__isnull=False))
            .select_related("film", "user", "rating")
            .annotate(has_review=Exists(
                Review.objects.filter(log=OuterRef("pk"))
            ))
            .order_by("-entry_date")[:50]
        )

        seen_ids = set()
        unique_logs = []
        for log in recent_logs:
            film_id = log.film.film_id
            if film_id not in seen_ids:
                seen_ids.add(film_id)
                unique_logs.append(log)
            if len(unique_logs) >= limit:
                break

        serializer = FriendsActivityFilmSerializer(unique_logs, many=True)
        return Response(serializer.data)
