from django.urls import path
from store.views.payment_views import create_payment
from .webhooks import stripe_webhook
from store.views.shop_views import product_list, user_purchases

urlpatterns = [
    path('create-payment/', create_payment, name='create-payment'),
    path('webhook/', stripe_webhook, name='stripe-webhook'),
    path("products/", product_list),
    path("purchases/", user_purchases),
]
