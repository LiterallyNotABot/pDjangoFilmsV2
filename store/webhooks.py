import stripe
from django.conf import settings
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META['HTTP_STRIPE_SIGNATURE']
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except (ValueError, stripe.error.SignatureVerificationError) as e:
        return HttpResponse(status=400)

    # Procesar evento (solo para testing)
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        logger.info("\u2705 Pago exitoso: %s", session['id'])

    return HttpResponse(status=200)
