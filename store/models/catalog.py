from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone
User = get_user_model()

class ProductCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        db_table: 'ProductCategories'
        verbose_name_plural = "Product Categories"

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    category = models.ForeignKey(ProductCategory, on_delete=models.PROTECT, related_name='products')
    price_cents = models.PositiveIntegerField()
    image_url = models.URLField(blank=True)
    stock = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        db_table: 'Products'

    def __str__(self):
        return f"{self.name} (${self.price_cents / 100:.2f})"

    def clean(self):
        if self.stock < 0:
            raise ValidationError({'stock': "Stock cannot be negative."})


class ProductStockChange(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='stock_changes')
    change = models.IntegerField()
    reason = models.CharField(max_length=255)
    timestamp = models.DateTimeField(default=timezone.now)
    triggered_by = models.ForeignKey(
        User, null=True, blank=True,
        on_delete=models.SET_NULL, related_name='stock_changes'
    )
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    def __str__(self):
        return f"{self.change:+} units on {self.product.name} ({self.reason})"