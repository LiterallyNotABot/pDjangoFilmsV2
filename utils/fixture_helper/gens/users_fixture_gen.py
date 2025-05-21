import os
import django
import json
from faker import Faker
from django.utils.timezone import now
from django.contrib.auth.hashers import make_password

# Configuración Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pDjangoFilmsV2.settings')
django.setup()

fake = Faker()

def main():
    users = []

    for i in range(5):
        user_id = 6 + i  # IDs del 6 al 10

        users.append({
            "model": "auth.user",
            "pk": user_id,
            "fields": {
                "username": fake.user_name(),
                "email": fake.email(),
                "first_name": fake.first_name(),
                "last_name": fake.last_name(),
                "is_staff": False,
                "is_superuser": False,
                "is_active": True,
                "date_joined": now().isoformat(),
                "password": make_password("password123")
            }
        })

    output_path = os.path.join(os.path.dirname(__file__), "../fixtures", "users.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(users, f, indent=4, ensure_ascii=False)

    print(f"✅ Fixture generado con 5 usuarios (ID 6–10) en {output_path}")

if __name__ == "__main__":
    main()
