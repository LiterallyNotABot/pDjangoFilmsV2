# views/person_views.py
from django.db.models import Count
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from films.models import Person, FilmAndPerson
from films.serializers.serializers import PersonSerializer

@api_view(['GET'])
@permission_classes([AllowAny])
def get_person_by_id(request, pk):
    try:
        person = Person.objects.get(person_id=pk)
    except Person.DoesNotExist:
        return Response({"detail": "Person not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = PersonSerializer(person)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_person_roles(request, person_id):
    roles = (
        FilmAndPerson.objects
        .filter(person_id=person_id, active=True, deleted=False, role__active=True, role__deleted=False)
        .values("role__name")
        .annotate(count=Count("film_id"))
        .order_by("-count")
    )
    return Response([
        { "role": r["role__name"], "count": r["count"] }
        for r in roles
    ])