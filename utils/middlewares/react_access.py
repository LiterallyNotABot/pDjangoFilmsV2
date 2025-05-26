from django.http import HttpResponseForbidden, HttpResponse

class OnlyReactAccessMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        path = request.path
        method = request.method
        origin = request.headers.get("Origin")
        print(f"[MIDDLEWARE] Path: {path}, Method: {method}, Origin: {origin}")

        # Allow OPTIONS
        if method == "OPTIONS":
            response = HttpResponse()
        else:
            # Protected internal routes
            protected_paths = ["/films/", "/persons/", "/users/", "/reviews/", ]
            if any(path.startswith(p) for p in protected_paths):
                if request.headers.get("X-Internal-Access") != "DjangoFilmsFrontend":
                    return HttpResponseForbidden("Access denied")
            response = self.get_response(request)

        # These headers MUST be present in any CORS response
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