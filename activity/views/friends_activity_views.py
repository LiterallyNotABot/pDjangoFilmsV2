from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from films.models import Film
from reviews.models import Log, Review
from users.models import Follower
from activity.serializers.friends_activity_serializer import FriendsActivityFilmSerializer
from films.serializers.mini_film_serializer import MiniFilmSerializer
from django.db.models import Q

class FriendsActivityFilmsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        limit = int(request.query_params.get("limit", 10))

        followed_ids = Follower.objects.filter(
            follower_user=user,
            active=True,
            deleted=False
        ).values_list("followed_user_id", flat=True)

        if not followed_ids:
            # fallback: last releases
            films = Film.objects.filter(active=True, deleted=False).order_by("-film_id")[:limit]
            serializer = MiniFilmSerializer(films, many=True)
            return Response(serializer.data)

        recent_logs = Log.objects.filter(
            user_id__in=followed_ids,
            active=True,
            deleted=False
        ).filter(
            Q(liked=True) | Q(rating__isnull=False) | Q(review__isnull=False)
        ).select_related("film", "user", "rating").order_by("-entry_date")[:50]

        seen_ids = set()
        result = []

        for log in recent_logs:
            film = log.film
            if film.film_id in seen_ids:
                continue
            seen_ids.add(film.film_id)

            result.append({
                "film_id": film.film_id,
                "id": film.film_id,
                "title": film.title,
                "year": film.release_year,
                "posterUrl": film.poster_url,
                "user": {
                    "username": log.user.username,
                    "liked": log.liked,
                    "rating": float(log.rating.rating_value) if log.rating else None,
                    "reviewed": Review.objects.filter(log=log, active=True, deleted=False).exists()
                }
            })

            if len(result) >= limit:
                break

        serializer = FriendsActivityFilmSerializer(result, many=True)
        return Response(serializer.data)