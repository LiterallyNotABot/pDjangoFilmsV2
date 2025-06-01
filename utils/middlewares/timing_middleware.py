import time
import logging

logger = logging.getLogger(__name__)

class TimingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = time.perf_counter()
        response = self.get_response(request)
        duration = time.perf_counter() - start_time

        # Log del endpoint y duración
        logger.info(f"{request.method} {request.get_full_path()} took {duration:.3f}s")

        # También puedes incluir el tiempo en los headers de respuesta
        response["X-Request-Duration"] = f"{duration:.3f}s"
        return response
