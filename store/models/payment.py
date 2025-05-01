from django.contrib.auth import get_user_model
from django.db import models
from store.models.catalog import Product
User = get_user_model()

class Purchase(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)
    total_cents = models.PositiveIntegerField()
    completed = models.BooleanField(default=True)
    active = models.BooleanField(default=True)
    deleted = models.BooleanField(default=False)

    class Meta:
        db_table = "Purchases"

    def __str__(self):
        return f"Purchase #{self.id} by {self.user}"


class PurchaseItem(models.Model):
    purchase = models.ForeignKey(Purchase, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    price_cents = models.PositiveIntegerField()  # Precio en el momento de compra

    class Meta:
        db_table = "PurchaseItems"

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"


class Payment(models.Model):
    purchase = models.OneToOneField(Purchase, on_delete=models.CASCADE, related_name='payment')
    stripe_session_id = models.CharField(max_length=255, unique=True)
    amount_cents = models.PositiveIntegerField()
    currency = models.CharField(max_length=10, default="usd")
    status = models.CharField(max_length=50)  # ej. 'succeeded', 'pending'
    received_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "Payments"

    def __str__(self):
        return f"Payment for Purchase #{self.purchase.id} – {self.status}"
