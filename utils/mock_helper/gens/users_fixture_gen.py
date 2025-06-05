import os
import django
import json
from faker import Faker
from django.utils.timezone import now
from django.contrib.auth.hashers import make_password
from pathlib import Path
from fixtures_config import MOCK_USER_START_ID, MOCK_USER_COUNT

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pDjangoFilmsV2.settings')
django.setup()

fake = Faker()

def generate_users(start_id, count):
    users = []
    for i in range(count):
        user_id = start_id + i
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
    return users

def save_fixture(data, filename):
    output_path = Path(__file__).resolve().parent.parent / "fixtures" / filename
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    print(f"✅ {filename} generado con {len(data)} usuarios en {output_path}")

def main():
    users = generate_users(MOCK_USER_START_ID, MOCK_USER_COUNT)
    save_fixture(users, "users.json")

if __name__ == "__main__":
    main()

