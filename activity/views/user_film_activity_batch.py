from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from films.models import Film
from users.models import FilmAndUser

class UserFilmActivityBatchView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        film_ids = request.data.get("film_ids", [])
        if not isinstance(film_ids, list):
            return Response({"detail": "film_ids must be a list"}, status=400)

        existing_films = Film.objects.filter(film_id__in=film_ids)
        film_map = {film.film_id: film for film in existing_films}

        response_data = []

        for film_id in film_ids:
            film = film_map.get(film_id)
            if not film:
                response_data.append({
                    "film_id": film_id,
                    "error": "Film not found"
                })
                continue

            film_user = FilmAndUser.all_objects.filter(user=request.user, film=film).first()

            response_data.append({
                "film_id": film_id,
                "liked": film_user.liked if film_user else False,
                "watched": film_user.watched if film_user else False,
                "reviewed": getattr(film_user, "reviewed", False),
                "watchlisted": getattr(film_user, "watchlisted", False),
            })

        return Response(response_data)
