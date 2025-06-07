from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from search.indexes.user import UserDocument
from search.indexes.person import PersonDocument
from search.indexes.list import ListDocument
from search.indexes.film import FilmDocument


@api_view(["GET"])
@permission_classes([AllowAny])
def global_search(request):
    query = request.GET.get("q", "").strip()
    if not query:
        return Response({"error": "Missing search query."}, status=400)

    limit = int(request.GET.get("limit", 5))

    results = {
        "films": [],
        "users": [],
        "persons": [],
        "lists": [],
    }

    # Films
    film_hits = FilmDocument.search().query(
        "multi_match",
        query=query,
        fields=["title", "synopsis", "genres", "cast", "directors"]
    )[:limit]

    for hit in film_hits:
        results["films"].append(hit.to_dict())

    # Users
    user_hits = UserDocument.search().query(
        "multi_match",
        query=query,
        fields=["bio", "location", "given_name", "username", "email"]
    )[:limit]

    for hit in user_hits:
        results["users"].append(hit.to_dict())

    # Persons
    person_hits = PersonDocument.search().query(
        "multi_match",
        query=query,
        fields=["name", "alias", "biography", "place_of_birth"]
    )[:limit]

    for hit in person_hits:
        results["persons"].append(hit.to_dict())

    # Lists
    list_hits = ListDocument.search().query(
        "multi_match",
        query=query,
        fields=["list_name", "list_description", "username"]
    )[:limit]

    for hit in list_hits:
        results["lists"].append(hit.to_dict())

    return Response(results)
