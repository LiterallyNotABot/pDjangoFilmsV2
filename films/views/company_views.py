from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from films.models import ProductionCompany
from films.serializers.serializers import ProductionCompanySerializer

@api_view(["GET"])
@permission_classes([AllowAny])
def get_company_by_id(request, pk):
    try:
        company = ProductionCompany.objects.get(pk=pk, active=True, deleted=False)
    except ProductionCompany.DoesNotExist:
        return Response({"detail": "Company not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = ProductionCompanySerializer(company)
    return Response(serializer.data)
