import os
import sys
import django
import time
import requests
from decimal import Decimal

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pDjangoFilmsV2.settings')
django.setup()

from tmdb_connector import search_movies, get_movie_details, get_movie_credits
from population_helper import *

sleep_time=0.1

def safe_sleep(seconds=sleep_time):
    time.sleep(seconds)

def import_movies_by_query(query):
    first_page = search_movies(query)
    safe_sleep()
    total_pages = first_page.get('total_pages', 1)

    for page in range(1, total_pages + 1):
        print(f"Processing page {page}/{total_pages}")
        page_data = search_movies(query, page=page)
        safe_sleep()
        movies = page_data.get('results', [])

        for movie_data in movies:
            movie_id = movie_data['id']
            print(f"Importing movie ID {movie_id}: {movie_data.get('title')}")

            full_details = get_movie_details_safe(movie_id)
            safe_sleep()
            credits = get_movie_credits_safe(movie_id)
            safe_sleep()

            if not full_details or not credits:
                print(f"Skipping movie ID {movie_id} due to missing data.")
                continue  # No procesar si no tenemos detalles o créditos

            print(f"Full details for movie ID {movie_id}: {full_details}")

            release_year = None
            if full_details.get('release_date'):
                try:
                    release_year = int(full_details['release_date'][:4])
                except (ValueError, TypeError):
                    release_year = None

            popularity = full_details.get('popularity')
            if popularity is not None:
                popularity = Decimal(str(popularity))

            film = insert_or_update_film({
                'title': full_details.get('title'),
                'release_year': release_year,
                'runtime': full_details.get('runtime'),
                'synopsis': full_details.get('overview'),
                'budget': full_details.get('budget'),
                'revenue': full_details.get('revenue'),
                'status': full_details.get('status'),
                'tagline': full_details.get('tagline'),
                'poster_url': f"https://image.tmdb.org/t/p/original{full_details['poster_path']}" if full_details.get('poster_path') else '',
                'backdrop_url': f"https://image.tmdb.org/t/p/original{full_details['backdrop_path']}" if full_details.get('backdrop_path') else '',
                'popularity': popularity,
                'api_film_id': full_details.get('id')
            })

            insert_genres(film, full_details.get('genres', []))
            insert_people_and_roles(film, credits.get('cast', []), credits.get('crew', []))
            insert_production_companies(film, full_details.get('production_companies', []))
            insert_countries(film, full_details.get('production_countries', []))
            insert_languages(film, full_details.get('spoken_languages', []), original_language_code=full_details.get('original_language'))

def get_movie_details_safe(movie_id):
    try:
        return get_movie_details(movie_id)
    except requests.exceptions.HTTPError as e:
        print(f"Error fetching movie details for ID {movie_id}: {e}")
        return None

def get_movie_credits_safe(movie_id):
    try:
        return get_movie_credits(movie_id)
    except requests.exceptions.HTTPError as e:
        print(f"Error fetching movie credits for ID {movie_id}: {e}")
        return None


if __name__ == '__main__':
    title = input("Enter the movie title to search: ")
    import_movies_by_query(title)