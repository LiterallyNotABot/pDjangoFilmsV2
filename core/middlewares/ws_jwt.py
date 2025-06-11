# core/middlewares/ws_jwt.py

from django.conf import settings
from urllib.parse import parse_qs
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.settings import api_settings
from jwt import decode as jwt_decode, InvalidTokenError

User = get_user_model()
# Aquí sacamos el SIGNING_KEY que SimpleJWT ya toma de settings.SIMPLE_JWT['SIGNING_KEY']
SECRET_KEY = api_settings.SIGNING_KEY

class JWTAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        if scope.get('type') == 'websocket':
            qs = parse_qs(scope.get('query_string', b'').decode())
            token_list = qs.get('token', None)
            if token_list:
                token = token_list[0]
                try:
                    UntypedToken(token)  # verifica firma y expiración
                    payload = jwt_decode(token, SECRET_KEY, algorithms=[api_settings.ALGORITHM])
                    user = await User.objects.aget(id=payload.get('user_id'))
                    scope['user'] = user
                except (InvalidTokenError, User.DoesNotExist):
                    scope['user'] = AnonymousUser()
            else:
                scope['user'] = AnonymousUser()

        return await self.inner(scope, receive, send)
