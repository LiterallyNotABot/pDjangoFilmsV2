import json
from pathlib import Path

ratings = []
for i, val in enumerate([x * 0.5 for x in range(1, 11)], start=1):
    ratings.append({
        "model": "reviews.rating",  # ← ✅ nombre correcto de la app
        "pk": i,
        "fields": {
            "rating_value": str(round(val, 1)),
            "active": True,
            "deleted": False
        }
    })

path = Path(__file__).resolve().parent.parent / "fixtures" / "rating_values.json"
with open(path, "w", encoding="utf-8") as f:
    json.dump(ratings, f, indent=4, ensure_ascii=False)

print(f"✅ ratings.json generado con {len(ratings)} registros.")
