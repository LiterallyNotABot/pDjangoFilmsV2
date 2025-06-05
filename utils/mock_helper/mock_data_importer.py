import os
import json
import django
from pathlib import Path
from django.core.management import call_command

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pDjangoFilmsV2.settings')
django.setup()

BASE_DIR = Path(__file__).resolve().parent
FIXTURE_DIR = BASE_DIR / "fixtures"

FIXTURES_ORDER = [
    "users.json",
    "rating_values.json",
    "followers.json",
    "film_and_user.json",
    "lists.json",
    "list_and_film.json",
    "list_and_like_by_user.json",
    "watchlist.json",
    "logs.json",
    "reviews.json",
    "review_and_like_by_user.json"
]

def load_fixture(file_path):
    print(f"📥 Loading: {file_path.name}")
    try:
        call_command("loaddata", str(file_path))
    except Exception as e:
        print(f"❌ Error loading {file_path.name}: {e}")

def main():
    print("🚀 Starting fixture loading...\n")

    for filename in FIXTURES_ORDER:
        fixture_path = FIXTURE_DIR / filename
        if fixture_path.exists():
            load_fixture(fixture_path)
        else:
            print(f"⚠️  {filename} not found. Skipping.")

    print("\n✅ All fixtures loaded successfully.")

if __name__ == "__main__":
    main()
