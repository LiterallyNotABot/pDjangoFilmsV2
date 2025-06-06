from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from films.models import Genre
from films.serializers.serializers import GenreSerializer

@api_view(["GET"])
@permission_classes([AllowAny])
def get_genre_by_id(request, pk):
    try:
        genre = Genre.objects.get(pk=pk, active=True, deleted=False)
    except Genre.DoesNotExist:
        return Response({"detail": "Genre not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = GenreSerializer(genre)
    return Response(serializer.data)