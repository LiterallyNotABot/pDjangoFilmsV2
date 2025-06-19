import stripe
from django.conf import settings

stripe.api_key = settings.STRIPE_SECRET_KEY

def create_checkout_session(line_items, currency="usd"):
    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        line_items=line_items,
        mode="payment",
        success_url=f"{settings.REACT_BASE_URL}/shop?tab=orders",
        cancel_url=f"{settings.REACT_BASE_URL}/shop?tab=cart",
    )
    return session
