import requests
import random
from django.core.management.base import BaseCommand
from store.models.catalog import Product, ProductCategory

class Command(BaseCommand):
    help = 'Load mock products from fakestoreapi.com with random stock'

    def handle(self, *args, **kwargs):
        url = "https://fakestoreapi.com/products"
        response = requests.get(url)
        if response.status_code != 200:
            self.stderr.write("Failed to fetch products from fakestoreapi.com")
            return

        products = response.json()
        self.stdout.write(f"Importing {len(products)} products...")

        for item in products:
            category_name = item['category'].title()
            category, _ = ProductCategory.objects.get_or_create(name=category_name)

            price_cents = int(float(item['price']) * 100)
            stock = random.randint(5, 30)

            product, created = Product.objects.get_or_create(
                name=item['title'],
                defaults={
                    'description': item['description'],
                    'price_cents': price_cents,
                    'image_url': item['image'],
                    'category': category,
                    'stock': stock,
                }
            )

            if created:
                self.stdout.write(f"Created: {product.name} (stock: {stock})")
            else:
                self.stdout.write(f"Skipped: {product.name} already exists")

        self.stdout.write(self.style.SUCCESS("Mock products imported successfully"))
