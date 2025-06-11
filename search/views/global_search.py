from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from search.indexes.user import UserDocument
from search.indexes.person import PersonDocument
from search.indexes.list import ListDocument
from search.indexes.film import FilmDocument
from elasticsearch_dsl import Q

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

    film_query = Q(
        "function_score",
        query=Q("multi_match", query=query, fields=["title^4", "genres^3", "cast^2", "directors", "synopsis"]),
        functions=[
            {
                "field_value_factor": {
                    "field": "popularity",
                    "factor": 1.2,
                    "modifier": "sqrt",
                    "missing": 1
                }
            }
        ],
        boost_mode="sum",
        score_mode="sum"
    )
    film_hits = FilmDocument.search().query(film_query)[:limit]
    for hit in film_hits:
        data = hit.to_dict()
        data["id"] = hit.meta.id
        results["films"].append(data)

    user_hits = UserDocument.search().query(
        "multi_match",
        query=query,
        fields=["bio", "location", "given_name", "username", "email"]
    )[:limit]
    for hit in user_hits:
        data = hit.to_dict()
        data["id"] = hit.meta.id
        results["users"].append(data)

    person_query = Q(
        "function_score",
        query=Q("multi_match", query=query, fields=["name^4", "alias^2", "biography", "place_of_birth"]),
        functions=[
            {
                "script_score": {
                    "script": {
                        "source": """
                            String n = doc['name.raw'].value.toLowerCase();
                            String q = params.q.toLowerCase();
                            return n.contains(q) ? 500 : 0;
                        """,
                        "params": {"q": query}
                    }
                }
            },
            {
                "field_value_factor": {
                    "field": "relevance_score",
                    "factor": 5.0,
                    "modifier": "sqrt",
                    "missing": 1
                }
            }
        ],
        boost_mode="sum",
        score_mode="sum"
    )
    person_hits = PersonDocument.search().query(person_query)[:limit]
    for hit in person_hits:
        data = hit.to_dict()
        data["id"] = hit.meta.id
        results["persons"].append(data)

    list_hits = ListDocument.search().query(
        "multi_match",
        query=query,
        fields=["list_name^3", "list_description"]
    )[:limit]
    for hit in list_hits:
        data = hit.to_dict()
        data["id"] = hit.meta.id
        results["lists"].append(data)

    return Response(results)
