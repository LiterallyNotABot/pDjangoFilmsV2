"""
ASGI config for pDjangoFilmsV2 project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pDjangoFilmsV2.settings')
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

django_asgi_app = get_asgi_application()
import comms.routing  # importa el routing de WebSocket de tu app "comms"

application = ProtocolTypeRouter({
    "http": get_asgi_application(),  # sigue sirviendo páginas normales
    "websocket": AuthMiddlewareStack(
        URLRouter(
            comms.routing.websocket_urlpatterns
        )
    ),
})
