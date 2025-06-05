from rest_framework import status, views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.models import Watchlist
from users.serializers.watchlist_serializer import WatchlistSerializer

class ToggleWatchlistEntryView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, film_id):
        user = request.user
        exists = Watchlist.objects.filter(user=user, film_id=film_id).exists()
        return Response({"in_watchlist": exists})

    def post(self, request, film_id):
        user = request.user
        if Watchlist.objects.filter(user=user, film_id=film_id).exists():
            return Response({"detail": "Already in watchlist."}, status=status.HTTP_409_CONFLICT)

        entry = Watchlist.objects.create(user=user, film_id=film_id)
        serializer = WatchlistSerializer(entry)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request, film_id):
        user = request.user
        entry = Watchlist.objects.filter(user=user, film_id=film_id).first()
        if not entry:
            return Response({"detail": "Not in watchlist."}, status=status.HTTP_404_NOT_FOUND)

        entry.delete()
        return Response({"detail": "Removed from watchlist."}, status=status.HTTP_200_OK)
