from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from store.models.catalog import Product
from store.models.cart_and_checkout import Cart, CartItem, CheckoutSession
from store.stripe_manager import create_checkout_session

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_payment(request):
    items = request.data.get("items", [])
    user = request.user

    if not isinstance(items, list) or not items:
        return Response({"error": "Invalid or empty items list."}, status=status.HTTP_400_BAD_REQUEST)

    line_items = []
    cart = Cart.objects.create(user=user, created_at=timezone.now())

    # Limpiar carrito actual antes de agregar
    CartItem.objects.filter(cart=cart).delete()

    for item in items:
        try:
            product = Product.objects.get(id=item["product_id"], active=True, deleted=False)
        except Product.DoesNotExist:
            return Response({"error": f"Product {item['product_id']} not found."}, status=404)

        quantity = max(1, int(item.get("quantity", 1)))

        # Agregar al carrito
        CartItem.objects.create(cart=cart, product=product, quantity=quantity)

        # Agregar al line_items de Stripe
        line_items.append({
            "price_data": {
                "currency": "usd",
                "unit_amount": product.price_cents,
                "product_data": {
                    "name": product.name,
                },
            },
            "quantity": quantity,
        })

    # Crear sesión de Stripe
    session = create_checkout_session(line_items)

    # Registrar sesión en base
    CheckoutSession.objects.update_or_create(
        cart=cart,
        defaults={
            "stripe_session_id": session.id,
            "completed": False,
        }
    )

    return Response({"checkout_url": session.url})
