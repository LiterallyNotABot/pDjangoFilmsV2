from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from store.models import Purchase
from store.models.catalog import Product
from store.serializers.shop import ProductSerializer, PurchaseSerializer


@api_view(['GET'])
@permission_classes([AllowAny])
def product_list(request):
    products = Product.objects.filter(active=True, deleted=False)
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_purchases(request):
    purchases = Purchase.objects.filter(user=request.user, deleted=False).order_by("-created_at")
    serializer = PurchaseSerializer(purchases, many=True)
    return Response(serializer.data)