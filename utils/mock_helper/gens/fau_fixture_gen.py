import os
import json
import random
from datetime import datetime
from pathlib import Path
from fixtures_config import *

BASE_DIR = Path(__file__).resolve().parent
FIXTURE_DIR = BASE_DIR.parent / "fixtures"

with open(FIXTURE_DIR / "films.json", encoding="utf-8") as f:
    films = json.load(f)

film_ids = [int(f["film_id"]) for f in films]

film_and_user = []
fau_pk = 1
for user_id in MOCK_USER_IDS:
    user_films = random.sample(film_ids, k=min(FILMS_PER_USER, len(film_ids)))
    for film_id in user_films:
        film_and_user.append({
            "model": "users.filmanduser",
            "pk": fau_pk,
            "fields": {
                "film": film_id,
                "user": user_id,
                "rating": None,
                "watched": random.choice([True, False]),
                "liked": random.choice([True, False]),
                "active": True,
                "deleted": False
            }
        })
        fau_pk += 1

follower_relations = []
follower_pk = 1
for user in MOCK_USER_IDS:
    candidates = [u for u in MOCK_USER_IDS if u != user]
    follows = random.sample(candidates, k=min(FOLLOWERS_PER_USER, len(candidates)))
    for followed in follows:
        follower_relations.append({
            "model": "users.follower",
            "pk": follower_pk,
            "fields": {
                "follower_user": user,
                "followed_user": followed,
                "date_followed": datetime.now().isoformat(),
                "active": True,
                "deleted": False
            }
        })
        follower_pk += 1

lists = []
list_and_film = []
list_and_like = []
list_pk = 1
laf_pk = 1
like_pk = 1

for user_id in MOCK_USER_IDS:
    for i in range(LISTS_PER_USER):
        lists.append({
            "model": "users.list",
            "pk": list_pk,
            "fields": {
                "user": user_id,
                "list_name": f"User{user_id}_List{i+1}",
                "list_description": f"Auto-generated list {i+1}",
                "date_of_creation": datetime.now().isoformat(),
                "active": True,
                "deleted": False
            }
        })

        film_sample = random.sample(film_ids, k=random.randint(LIST_FILMS_MIN, LIST_FILMS_MAX))
        for order, film_id in enumerate(film_sample, start=1):
            list_and_film.append({
                "model": "users.listandfilm",
                "pk": laf_pk,
                "fields": {
                    "list": list_pk,
                    "film": film_id,
                    "sort_order": order,
                    "active": True,
                    "deleted": False
                }
            })
            laf_pk += 1

        likers = random.sample([u for u in MOCK_USER_IDS if u != user_id], k=random.randint(0, LIKES_PER_LIST_MAX))
        for liker_id in likers:
            list_and_like.append({
                "model": "users.listandlikebyuser",
                "pk": like_pk,
                "fields": {
                    "user": liker_id,
                    "list": list_pk,
                    "active": True,
                    "deleted": False
                }
            })
            like_pk += 1

        list_pk += 1

watchlist = []
watch_pk = 1
for user_id in MOCK_USER_IDS:
    films_watch = random.sample(film_ids, k=min(WATCHLIST_PER_USER, len(film_ids)))
    for film_id in films_watch:
        watchlist.append({
            "model": "users.watchlist",
            "pk": watch_pk,
            "fields": {
                "film": film_id,
                "user": user_id,
                "date_added": datetime.now().isoformat(),
                "active": True,
                "deleted": False
            }
        })
        watch_pk += 1


def save_fixture(data, filename):
    path = FIXTURE_DIR / filename
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    print(f"✅ ({len(data)} entries {filename} created)")

save_fixture(film_and_user, "film_and_user.json")
save_fixture(follower_relations, "followers.json")
save_fixture(lists, "lists.json")
save_fixture(list_and_film, "list_and_film.json")
save_fixture(list_and_like, "list_and_like_by_user.json")
save_fixture(watchlist, "watchlist.json")
