from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from films.models import Country
from films.serializers.serializers import CountrySerializer

@api_view(["GET"])
@permission_classes([AllowAny])
def get_country_by_id(request, pk):
    try:
        country = Country.objects.get(pk=pk, active=True, deleted=False)
    except Country.DoesNotExist:
        return Response({"detail": "Country not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = CountrySerializer(country)
    return Response(serializer.data)