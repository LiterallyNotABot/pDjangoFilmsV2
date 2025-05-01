from django.db import models
from django.utils import timezone
from django.conf import settings
from store.models.catalog import Product


class Cart(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='carts')
    created_at = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        db_table = 'Carts'

    def __str__(self):
        return f"Cart #{self.pk} for {self.user}"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        db_table = 'CartItems'
        unique_together = ('cart', 'product')

    def __str__(self):
        return f"{self.quantity} × {self.product.name}"


class CheckoutSession(models.Model):
    cart = models.OneToOneField(Cart, on_delete=models.CASCADE, related_name='checkout_session')
    stripe_session_id = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completed = models.BooleanField(default=False)
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        db_table = 'CheckoutSessions'

    def __str__(self):
        return f"Checkout for Cart #{self.cart.id} ({'✔' if self.completed else 'Pending'})"


class CheckoutLog(models.Model):
    stripe_event_id = models.CharField(max_length=255, unique=True)
    payload = models.JSONField()
    received_at = models.DateTimeField(default=timezone.now)
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        db_table = 'CheckoutLogs'

    def __str__(self):
        return f"Stripe Event: {self.stripe_event_id}"