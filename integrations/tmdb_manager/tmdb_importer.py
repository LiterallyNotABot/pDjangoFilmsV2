import datetime
import os
import sys
import django
import time

# Set up Django environment
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pDjangoFilmsV2.settings')
django.setup()

from tmdb_connector import search_movies, get_movie_details, get_movie_credits
from population_helper import *

sleep_time=0.1

def safe_sleep(seconds=sleep_time):
    print(f"Sleeping {seconds} seconds to respect API rate limits...")
    time.sleep(seconds)


def import_movies_by_query(query):
    first_page = search_movies(query)
    safe_sleep()  # <-- added
    total_pages = first_page.get('total_pages', 1)

    for page in range(1, total_pages + 1):
        print(f"Processing page {page}/{total_pages}")
        page_data = search_movies(query, page=page)
        safe_sleep()  # <-- added
        movies = page_data.get('results', [])

        for movie_data in movies:
            movie_id = movie_data['id']
            print(f"Importing movie ID {movie_id}: {movie_data.get('title')}")

            full_details = get_movie_details(movie_id)
            safe_sleep()  # <-- added

            credits = get_movie_credits(movie_id)
            safe_sleep()  # <-- added

            release_year = None
            if full_details.get('release_date'):
                try:
                    year = int(full_details['release_date'][:4])
                    current_year = datetime.datetime.now().year
                    if 1880 <= year <= (current_year + 1):
                        release_year = year
                except (ValueError, TypeError):
                    release_year = None

            film = insert_or_update_film({
                'title': full_details.get('title'),
                'release_year': int(full_details.get('release_date', '0000')[:4]) if full_details.get(
                    'release_date') else None,
                'runtime': full_details.get('runtime'),
                'synopsis': full_details.get('overview'),
                'budget': full_details.get('budget'),
                'revenue': full_details.get('revenue'),
                'status': full_details.get('status'),
                'tagline': full_details.get('tagline'),
                'poster_url': f"https://image.tmdb.org/t/p/original{full_details['poster_path']}" if full_details.get(
                    'poster_path') else '',
                'backdrop_url': f"https://image.tmdb.org/t/p/original{full_details['backdrop_path']}" if full_details.get(
                    'backdrop_path') else '',
            })

            insert_genres(film, full_details.get('genres', []))
            insert_people_and_roles(film, credits.get('cast', []), credits.get('crew', []))
            insert_production_companies(film, full_details.get('production_companies', []))
            insert_countries(film, full_details.get('production_countries', []))  # <-- AGREGA ESTA LINEA
            insert_languages(film, full_details.get('spoken_languages', []), original_language_code=full_details.get('original_language'))  # <-- Y ESTA


if __name__ == '__main__':
    title = input("Enter the movie title to search: ")
    import_movies_by_query(title)
