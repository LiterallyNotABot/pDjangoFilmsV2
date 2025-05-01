from django.urls import path
from .views import create_payment
from .webhooks import stripe_webhook

urlpatterns = [
    path('create-payment/', create_payment, name='create-payment'),
    path('webhook/', stripe_webhook, name='stripe-webhook'),
]
