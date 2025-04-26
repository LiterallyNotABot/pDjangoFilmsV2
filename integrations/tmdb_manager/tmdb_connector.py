import requests

API_KEY = 'ffb643bf7b157410e8ee164302dd9bd5'
BASE_URL = 'https://api.themoviedb.org/3'


def search_movies(query, page=1):
    url = f"{BASE_URL}/search/movie"
    params = {
        'api_key': API_KEY,
        'query': query,
        'language': 'en-US',
        'page': page
    }
    response = requests.get(url, params=params)
    response.raise_for_status()
    return response.json()

def get_movie_details(movie_id):
    url = f"{BASE_URL}/movie/{movie_id}"
    params = {
        'api_key': API_KEY,
        'language': 'en-US'
    }
    response = requests.get(url, params=params)
    response.raise_for_status()
    return response.json()

def get_movie_credits(movie_id):
    url = f"{BASE_URL}/movie/{movie_id}/credits"
    params = {
        'api_key': API_KEY,
        'language': 'en-US'
    }
    response = requests.get(url, params=params)
    response.raise_for_status()
    return response.json()

def get_person_details(person_id):
    url = f"{BASE_URL}/person/{person_id}"
    params = {
        'api_key': API_KEY,
        'language': 'en-US'
    }
    response = requests.get(url, params=params)
    response.raise_for_status()
    return response.json()
