import stripe
from django.conf import settings
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from store.models.cart_and_checkout import CheckoutSession
from store.models.cart_and_checkout import CartItem
from store.models.payment import Purchase, PurchaseItem
from store.models.cart_and_checkout import CheckoutLog

@csrf_exempt
def stripe_webhook(request):
    import json
    payload = request.body
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except (ValueError, stripe.error.SignatureVerificationError):
        return HttpResponse(status=400)

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        session_id = session["id"]

        CheckoutLog.objects.create(
            stripe_event_id=event["id"],
            payload=event,
        )

        try:
            checkout = CheckoutSession.objects.select_related("cart", "cart__user").get(
                stripe_session_id=session_id,
                completed=False,
                deleted=False,
            )
        except CheckoutSession.DoesNotExist:
            return HttpResponse("Checkout session not found or already completed", status=404)

        cart = checkout.cart
        user = cart.user

        items = CartItem.objects.filter(cart=cart, deleted=False)
        total_cents = sum(item.product.price_cents * item.quantity for item in items)

        purchase = Purchase.objects.create(
            user=user,
            total_cents=total_cents,
            completed=True,
            active=True,
            deleted=False,
        )

        for item in items:
            PurchaseItem.objects.create(
                purchase=purchase,
                product=item.product,
                quantity=item.quantity,
                price_cents=item.product.price_cents,
            )

        from store.models.payment import Payment
        Payment.objects.create(
            purchase=purchase,
            stripe_session_id=session_id,
            amount_cents=total_cents,
            currency="usd",
            status="succeeded",
        )

        checkout.completed = True
        checkout.save()

    return HttpResponse(status=200)
