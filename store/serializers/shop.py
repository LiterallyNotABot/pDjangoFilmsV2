from rest_framework import serializers

from store.models import PurchaseItem, Purchase
from store.models.catalog import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'description',
            'price_cents',
            'image_url',
            'stock',
        ]

class PurchaseItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name")

    class Meta:
        model = PurchaseItem
        fields = ["product_name", "quantity", "price_cents"]

class PurchaseSerializer(serializers.ModelSerializer):
    items = PurchaseItemSerializer(many=True, read_only=True)

    class Meta:
        model = Purchase
        fields = ["id", "created_at", "total_cents", "items"]