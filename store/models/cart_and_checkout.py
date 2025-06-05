from django.contrib.auth import get_user_model
from django.db import models
from django.utils import timezone
from store.models.catalog import Product
from core.models import SoftDeleteModel, ActiveManager

User = get_user_model()


class Cart(SoftDeleteModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='carts')
    created_at = models.DateTimeField(auto_now_add=True)

    objects = ActiveManager()
    all_objects = models.Manager()

    class Meta:
        db_table = 'Carts'

    def __str__(self):
        return f"Cart #{self.pk} for {self.user}"


class CartItem(SoftDeleteModel):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)

    objects = ActiveManager()
    all_objects = models.Manager()

    class Meta:
        db_table = 'CartItems'
        unique_together = ('cart', 'product')

    def __str__(self):
        return f"{self.quantity} × {self.product.name}"


class CheckoutSession(SoftDeleteModel):
    cart = models.OneToOneField(Cart, on_delete=models.CASCADE, related_name='checkout_session')
    stripe_session_id = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completed = models.BooleanField(default=False)

    objects = ActiveManager()
    all_objects = models.Manager()

    class Meta:
        db_table = 'CheckoutSessions'

    def __str__(self):
        return f"Checkout for Cart #{self.cart.id} ({'✔' if self.completed else 'Pending'})"


class CheckoutLog(SoftDeleteModel):
    stripe_event_id = models.CharField(max_length=255, unique=True)
    payload = models.JSONField()
    received_at = models.DateTimeField(default=timezone.now)

    objects = ActiveManager()
    all_objects = models.Manager()

    class Meta:
        db_table = 'CheckoutLogs'

    def __str__(self):
        return f"Stripe Event: {self.stripe_event_id}"
