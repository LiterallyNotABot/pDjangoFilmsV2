from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.models import FilmAndUser

class UserFilmActivityBatchView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        film_ids = request.data.get("film_ids", [])
        if not isinstance(film_ids, list):
            return Response({"detail": "film_ids must be a list"}, status=400)

        queryset = (
            FilmAndUser.objects
            .filter(user=request.user, film_id__in=film_ids)
            .only("film_id", "liked", "watched")
        )

        data = [
            {
                "film_id": entry.film_id,
                "liked": entry.liked,
                "watched": entry.watched,
            }
            for entry in queryset
        ]

        return Response(data)
