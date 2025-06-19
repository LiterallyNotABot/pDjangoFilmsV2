import requests

import pDjangoFilmsV2.settings
from django.conf import settings

BASE_URL = 'https://api.themoviedb.org/3'
API_KEY = settings.TMDB_API_KEY
def tmdb_get(endpoint, params=None):
    if params is None:
        params = {}
    params['api_key'] = API_KEY
    params['language'] = 'en-US'

    url = f"{BASE_URL}{endpoint}"
    response = requests.get(url, params=params)
    response.raise_for_status()
    return response.json()

def search_movies(query, page=1):
    return tmdb_get('/search/movie', {'query': query, 'page': page})

def get_movie_details(movie_id):
    return tmdb_get(f'/movie/{movie_id}')

def get_movie_credits(movie_id):
    return tmdb_get(f'/movie/{movie_id}/credits')

def get_person_details(person_id):
    return tmdb_get(f'/person/{person_id}')
