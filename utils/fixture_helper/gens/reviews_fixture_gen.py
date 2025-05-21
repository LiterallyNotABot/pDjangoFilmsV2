import json
import random
from datetime import datetime
from pathlib import Path

# === Paths ===
BASE_DIR = Path(__file__).resolve().parent
FIXTURE_DIR = BASE_DIR.parent / "fixtures"

# === Cargar datos base ===
with open(FIXTURE_DIR / "films.json", encoding="utf-8") as f:
    films = json.load(f)

from mock_data.review_bodies_mock import REVIEW_BODIES

film_ids = [film["film_id"] for film in films]
user_ids = list(range(1, 11))  # 10 usuarios
rating_ids = list(range(1, 11))  # 10 ratings (de 0.5 a 5.0)

# === Generar Logs ===
logs = []
log_refs = []
log_pk = 1

for user_id in user_ids:
    user_films = random.sample(film_ids, k=random.randint(5, 10))
    for film_id in user_films:
        rating_id = random.choice(rating_ids)
        logs.append({
            "model": "reviews.log",
            "pk": log_pk,
            "fields": {
                "film": film_id,
                "user": user_id,
                "rating": rating_id,
                "liked": random.choice([True, False]),
                "entry_date": datetime.now().isoformat(),
                "active": True,
                "deleted": False
            }
        })
        log_refs.append((log_pk, user_id))
        log_pk += 1

# === Generar Reviews (60% de logs) ===
reviews = []
review_pk = 1
reviewed_logs = random.sample(log_refs, k=int(len(log_refs) * 0.6))

for log_id, _ in reviewed_logs:
    reviews.append({
        "model": "reviews.review",
        "pk": review_pk,
        "fields": {
            "log": log_id,
            "body": random.choice(REVIEW_BODIES),
            "active": True,
            "deleted": False
        }
    })
    review_pk += 1

# === Generar ReviewAndLikeByUser (likes de otros usuarios a logs con review) ===
review_likes = []
like_pk = 1
for log_id, author_id in reviewed_logs:
    likers = random.sample([u for u in user_ids if u != author_id], k=random.randint(0, 4))
    for liker_id in likers:
        review_likes.append({
            "model": "reviews.reviewandlikebyuser",
            "pk": like_pk,
            "fields": {
                "log": log_id,
                "user": liker_id,
                "active": True,
                "deleted": False
            }
        })
        like_pk += 1

# === Guardar ===
def save(data, name):
    path = FIXTURE_DIR / f"{name}.json"
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    print(f"✅ {name}.json generado con {len(data)} registros.")

save(logs, "logs")
save(reviews, "reviews")
save(review_likes, "review_and_like_by_user")
