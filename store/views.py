from django.http import JsonResponse
from .stripe_manager import create_checkout_session

def create_payment(request):
    session = create_checkout_session("Fake Ticket", 1000)  # $10.00
    return JsonResponse({'checkout_url': session.url})
