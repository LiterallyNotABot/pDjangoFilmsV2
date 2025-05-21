import json
import random
from datetime import datetime
from pathlib import Path
from fixtures_config import *

BASE_DIR = Path(__file__).resolve().parent
FIXTURE_DIR = BASE_DIR.parent / "fixtures"

with open(FIXTURE_DIR / "films.json", encoding="utf-8") as f:
    films = json.load(f)

from mock_data.review_bodies_mock import REVIEW_BODIES

film_ids = [film["film_id"] for film in films]
rating_ids = list(range(1, RATINGS_COUNT + 1))

logs = []
log_refs = []
log_pk = 1

for user_id in MOCK_USER_IDS:
    user_films = random.sample(film_ids, k=min(FILMS_PER_USER_LOG, len(film_ids)))
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

reviews = []
review_pk = 1
reviewed_logs = random.sample(log_refs, k=int(len(log_refs) * REVIEWS_PERCENTAGE))

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

review_likes = []
like_pk = 1
for log_id, author_id in reviewed_logs:
    likers = random.sample(
        [u for u in MOCK_USER_IDS if u != author_id],
        k=random.randint(0, LIKES_PER_REVIEW_MAX)
    )
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

def save(data, name):
    path = FIXTURE_DIR / f"{name}.json"
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    print(f"✅ {name}.json created with {len(data)} entries.")

save(logs, "logs")
save(reviews, "reviews")
save(review_likes, "review_and_like_by_user")
