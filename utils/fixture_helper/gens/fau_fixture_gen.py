import os
import json
import random
from datetime import datetime
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
FIXTURE_DIR = BASE_DIR.parent / "fixtures"

# Cargar fixtures base
with open(FIXTURE_DIR / "films.json", encoding="utf-8") as f:
    films = json.load(f)

with open(FIXTURE_DIR / "users.json", encoding="utf-8") as f:
    users = json.load(f)

film_ids = [int(film["film_id"]) for film in films]
user_ids = list(range(1, 11))

# Generar FilmAndUser
film_and_user = []
pk_counter = 1
for user_id in user_ids:
    user_films = random.sample(film_ids, k=random.randint(5, 15))
    for film_id in user_films:
        film_and_user.append({
            "model": "films.filmanduser",
            "pk": pk_counter,
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
        pk_counter += 1

# Generar Follower
follower_relations = []
follower_id = 1
for follower in user_ids:
    followed = random.sample([u for u in user_ids if u != follower], k=random.randint(1, 3))
    for target in followed:
        follower_relations.append({
            "model": "films.follower",
            "pk": follower_id,
            "fields": {
                "follower_user": follower,
                "followed_user": target,
                "date_followed": datetime.now().isoformat(),
                "active": True,
                "deleted": False
            }
        })
        follower_id += 1

# Generar List
lists = []
list_id_counter = 1
list_and_film = []
list_and_like = []
list_film_id = 1
like_id = 1

for user_id in user_ids:
    for i in range(random.randint(1, 2)):
        list_pk = list_id_counter
        lists.append({
            "model": "users.list",
            "pk": list_pk,
            "fields": {
                "user": user_id,
                "list_name": f"User{user_id}_List{i+1}",
                "list_description": "Generated list",
                "date_of_creation": datetime.now().isoformat(),
                "active": True,
                "deleted": False
            }
        })
        list_id_counter += 1

        # Películas en la lista
        films_in_list = random.sample(film_ids, k=random.randint(3, 10))
        for idx, film_id in enumerate(films_in_list):
            list_and_film.append({
                "model": "users.listsandfilm",
                "pk": list_film_id,
                "fields": {
                    "list": list_pk,
                    "film": film_id,
                    "sort_order": idx + 1,
                    "active": True,
                    "deleted": False
                }
            })
            list_film_id += 1

        # Likes de otros usuarios
        likers = random.sample([u for u in user_ids if u != user_id], k=random.randint(0, 3))
        for liker in likers:
            list_and_like.append({
                "model": "users.listsandlikebyuser",
                "pk": like_id,
                "fields": {
                    "user": liker,
                    "list": list_pk,
                    "active": True,
                    "deleted": False
                }
            })
            like_id += 1

# Generar Watchlist
watchlist = []
watchlist_id = 1
for user_id in user_ids:
    films_watched = random.sample(film_ids, k=random.randint(5, 12))
    for film_id in films_watched:
        watchlist.append({
            "model": "users.watchlist",
            "pk": watchlist_id,
            "fields": {
                "film": film_id,
                "user": user_id,
                "date_added": datetime.now().isoformat(),
                "active": True,
                "deleted": False
            }
        })
        watchlist_id += 1

def save_fixture(data, filename):
    with open(FIXTURE_DIR / "films_and_users.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    print(f"✅ {filename} generado ({len(data)} registros)")

save_fixture(film_and_user, "film_and_user.json")
save_fixture(follower_relations, "followers.json")
save_fixture(lists, "lists.json")
save_fixture(list_and_film, "list_and_film.json")
save_fixture(list_and_like, "list_and_like_by_user.json")
save_fixture(watchlist, "watchlist.json")
