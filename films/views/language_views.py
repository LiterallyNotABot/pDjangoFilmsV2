from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from films.models import Language
from films.serializers.serializers import LanguageSerializer

@api_view(["GET"])
@permission_classes([AllowAny])
def get_language_by_id(request, pk):
    try:
        language = Language.objects.get(pk=pk, active=True, deleted=False)
    except Language.DoesNotExist:
        return Response({"detail": "Language not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = LanguageSerializer(language)
    return Response(serializer.data)