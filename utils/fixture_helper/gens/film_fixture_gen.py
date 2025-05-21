import os
import django
import json
import unicodedata
from films.models import Film
from mock_data.film_mock import film_titles

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pDjangoFilmsV2.settings')
django.setup()

def normalize_title(title):
    return unicodedata.normalize("NFKD", title.lower()).strip()

def serialize_instance(instance):
    return {
        field.name: str(getattr(instance, field.name)) if getattr(instance, field.name) is not None else None
        for field in instance._meta.fields
    }

def main():
    normalized_targets = {normalize_title(t): t for t in film_titles}
    found = {}
    all_films = Film.objects.all()

    for film in all_films:
        norm_title = normalize_title(film.title)
        if norm_title in normalized_targets:
            current = found.get(norm_title)
            if current is None or (film.popularity or 0) > (current.popularity or 0):
                found[norm_title] = film

    matched = [serialize_instance(f) for f in found.values()]
    print(f"🎬 Películas encontradas: {len(matched)}")

    missing_titles = [
        original for norm, original in normalized_targets.items()
        if norm not in found
    ]

    if missing_titles:
        print("\n❌ Títulos no encontrados:")
        for title in missing_titles:
            print("-", title)
    else:
        print("\n🎉 Todos los títulos fueron encontrados.")

    output_path = os.path.join(os.path.dirname(__file__), "../fixtures", "films.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(matched, f, indent=4, ensure_ascii=False)

    print(f"✅ Exported to {output_path}")

if __name__ == "__main__":
    main()
