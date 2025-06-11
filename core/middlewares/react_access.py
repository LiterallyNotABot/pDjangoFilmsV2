from django.http import HttpResponseForbidden, HttpResponse

class OnlyReactAccessMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        path = request.path
        method = request.method
        origin = request.headers.get("Origin")

        # Allow OPTIONS
        if method == "OPTIONS":
            response = HttpResponse()
        else:
            # Protected internal routes (except webhook)
            protected_paths = [
                "/films/",
                "/persons/",
                "/users/",
                "/reviews/",
                "/activity/",
                "/search/",
                "/comms/",
                "/store/",
            ]
            # Open pipeline for Stripe service
            excluded_paths = ["/store/webhook/"]

            if any(path.startswith(p) for p in protected_paths) and path not in excluded_paths:
                if request.headers.get("X-Internal-Access") != "DjangoFilmsFrontend":
                    return HttpResponseForbidden("Access denied")

            response = self.get_response(request)

        # Add CORS headers if coming from allowed frontend origins
        if origin in [
            "http://localhost:5173",
            "http://localhost:5174",
            "http://127.0.0.1:5173",
        ]:
            response["Access-Control-Allow-Origin"] = origin
            response["Access-Control-Allow-Credentials"] = "true"
            response["Access-Control-Allow-Headers"] = "Authorization, X-Internal-Access, Content-Type"
            response["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"

        return response
