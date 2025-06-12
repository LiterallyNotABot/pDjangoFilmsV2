from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from core.helpers import reactivate_or_create
from films.models import Film
from users.models import FilmAndUser

class UserFilmActivityBatchView(APIView):
    class UserFilmActivityBatchView(APIView):
        permission_classes = [IsAuthenticated]

        def post(self, request):
            film_ids = request.data.get("film_ids", [])
            if not isinstance(film_ids, list):
                return Response({"detail": "film_ids must be a list"}, status=400)

            # Validar existencia de películas
            existing_films = Film.objects.filter(id__in=film_ids)
            film_map = {film.id: film for film in existing_films}

            response_data = []

            for film_id in film_ids:
                film = film_map.get(film_id)
                if not film:
                    response_data.append({
                        "film_id": film_id,
                        "error": "Film not found"
                    })
                    continue

                # Soft create o recuperar relación
                film_user, _ = reactivate_or_create(
                    FilmAndUser,
                    lookup={"user": request.user, "film": film},
                    defaults={"user": request.user, "film": film}
                )

                response_data.append({
                    "film_id": film_id,
                    "liked": film_user.liked,
                    "watched": film_user.watched,
                    "reviewed": getattr(film_user, "reviewed", False),
                    "watchlisted": getattr(film_user, "watchlisted", False),
                })

            return Response(response_data)