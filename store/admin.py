from django.contrib import admin
from .models import (
    ProductCategory, Product, ProductStockChange,
    Cart, CartItem, CheckoutSession, CheckoutLog,
    Purchase, PurchaseItem, Payment
)

admin.site.register(ProductCategory)
admin.site.register(Product)
admin.site.register(ProductStockChange)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(CheckoutSession)
admin.site.register(CheckoutLog)
admin.site.register(Purchase)
admin.site.register(PurchaseItem)
admin.site.register(Payment)
