'''

import requests
import json

API_KEY = 'ffb643bf7b157410e8ee164302dd9bd5'  # reemplazá con tu API key real
BASE_URL = 'https://api.themoviedb.org/3'

# Podés cambiar este ID por cualquier otro
MOVIE_ID = 27205  # Inception

def get_movie_details(movie_id):
    url = f'{BASE_URL}/movie/{movie_id}?api_key={API_KEY}&language=es-ES'
    response = requests.get(url)
    return response.json()

def get_movie_images(movie_id):
    url = f'{BASE_URL}/movie/{movie_id}/images?api_key={API_KEY}'
    response = requests.get(url)
    return response.json()

def get_movie_credits(movie_id):
    url = f'{BASE_URL}/movie/{movie_id}/credits?api_key={API_KEY}'
    response = requests.get(url)
    return response.json()

def get_person_details(person_id):
    url = f'{BASE_URL}/person/{person_id}?api_key={API_KEY}'
    response = requests.get(url)
    return response.json()

def main():
    print("=== Detalles de la película ===")
    details = get_movie_details(MOVIE_ID)
    print(json.dumps(details, indent=2, ensure_ascii=False))

    print("\n=== Imágenes de la película ===")
    images = get_movie_images(MOVIE_ID)
    print(json.dumps(images, indent=2, ensure_ascii=False))

    print("\n=== Créditos de la película ===")
    credits = get_movie_credits(MOVIE_ID)
    print(json.dumps(credits, indent=2, ensure_ascii=False))

    if credits.get('crew'):
        director = next((p for p in credits['crew'] if p['job'] == 'Director'), None)
        if director:
            print(f"\n=== Detalles del director: {director['name']} ===")
            person = get_person_details(director['id'])
            print(json.dumps(person, indent=2, ensure_ascii=False))

if __name__ == '__main__':
    main()
    '''


import requests
import json

API_KEY = 'ffb643bf7b157410e8ee164302dd9bd5'  # reemplazá con tu API key real
BASE_URL = 'https://api.themoviedb.org/3'

# Podés cambiar este ID por cualquier otro
MOVIE_ID = 27205  # Inception

def get_movie_details(movie_id):
    url = f'{BASE_URL}/movie/{movie_id}?api_key={API_KEY}&language=es-ES'
    response = requests.get(url)
    return response.json()

def get_movie_images(movie_id):
    url = f'{BASE_URL}/movie/{movie_id}/images?api_key={API_KEY}'
    response = requests.get(url)
    return response.json()

def get_movie_credits(movie_id):
    url = f'{BASE_URL}/movie/{movie_id}/credits?api_key={API_KEY}'
    response = requests.get(url)
    return response.json()

def get_person_details(person_id):
    url = f'{BASE_URL}/person/{person_id}?api_key={API_KEY}'
    response = requests.get(url)
    return response.json()

def main():
    print("=== Detalles de la película ===")
    details = get_movie_details(MOVIE_ID)
    print(json.dumps(details, indent=2, ensure_ascii=False))

    print("\n=== Imágenes de la película ===")
    images = get_movie_images(MOVIE_ID)
    print(json.dumps(images, indent=2, ensure_ascii=False))

    print("\n=== Actores de la película ===")
    credits = get_movie_credits(MOVIE_ID)

    # Filtramos solo los actores
    actors = credits.get('cast', [])
    for actor in actors:
        print(f"\nActor: {actor['name']} como {actor.get('character', 'sin personaje')}")

        # Obtener detalles del actor
        actor_details = get_person_details(actor['id'])
        print(f"  Biografía: {actor_details.get('biography', 'No disponible')}")
        print(f"  Fecha de nacimiento: {actor_details.get('birthday', 'No disponible')}")
        print(f"  Lugar de nacimiento: {actor_details.get('place_of_birth', 'No disponible')}")

        # Si tiene una imagen de perfil, mostrarla
        actor_image = actor_details.get('profile_path', None)
        if actor_image:
            print(f"  Imagen: https://www.themoviedb.org/t/p/w500{actor_image}")
        else:
            print("  Imagen: No disponible")

if __name__ == '__main__':
    main()
'''
'''
import requests
import json

API_KEY = 'ffb643bf7b157410e8ee164302dd9bd5'
BASE_URL = 'https://api.themoviedb.org/3'
MOVIE_ID = 27205  # Inception, podés cambiarlo

def get_json(url):
    response = requests.get(url)
    return response.json()

def get_movie_data(movie_id):
    movie_url = f'{BASE_URL}/movie/{movie_id}?api_key={API_KEY}&language=es-ES'
    return get_json(movie_url)

def get_credits(movie_id):
    credits_url = f'{BASE_URL}/movie/{movie_id}/credits?api_key={API_KEY}'
    return get_json(credits_url)

def get_person(person_id):
    person_url = f'{BASE_URL}/person/{person_id}?api_key={API_KEY}&language=es-ES'
    return get_json(person_url)

def main():
    # Película
    print("=== Película ===")
    movie = get_movie_data(MOVIE_ID)
    print(json.dumps(movie, indent=2, ensure_ascii=False))

    # Créditos
    credits = get_credits(MOVIE_ID)

    # Director
    director = next((crew for crew in credits.get("crew", []) if crew.get("job") == "Director"), None)
    if director:
        print("\n=== Director ===")
        director_data = get_person(director["id"])
        print(json.dumps(director_data, indent=2, ensure_ascii=False))
    else:
        print("\nNo se encontró director.")

    # Actor
    actor = credits.get("cast", [None])[0]
    if actor:
        print("\n=== Actor ===")
        actor_data = get_person(actor["id"])
        print(json.dumps(actor_data, indent=2, ensure_ascii=False))
    else:
        print("\nNo se encontró actor.")

if __name__ == '__main__':
    main()
    
    '''

'''
import requests
import json

API_KEY = 'ffb643bf7b157410e8ee164302dd9bd5'  # Usá tu propia API key si cambia
BASE_URL = 'https://api.themoviedb.org/3'
MOVIE_ID = 27205  # Cambialo si querés otra película

def get_movie_full_details(movie_id):
    url = f'{BASE_URL}/movie/{movie_id}?api_key={API_KEY}&language=es-ES'
    response = requests.get(url)
    return response.json()

def main():
    details = get_movie_full_details(MOVIE_ID)
    print(json.dumps(details, indent=2, ensure_ascii=False))

if __name__ == '__main__':
    main()
    '''
'''
import requests

API_KEY = 'ffb643bf7b157410e8ee164302dd9bd5'  # reemplazá con tu API Key real
BASE_URL = 'https://api.themoviedb.org/3'
MOVIE_ID = 27205  # ID de la película, podés cambiarlo

def get_movie_cast(movie_id):
    url = f'{BASE_URL}/movie/{movie_id}/credits?api_key={API_KEY}&language=es-ES'
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        cast = data.get('cast', [])
        print("=== Actores ===")
        for actor in cast:
            print(f"{actor.get('name')} como {actor.get('character')}")
    else:
        print(f"Error: {response.status_code}")

if __name__ == '__main__':
    get_movie_cast(MOVIE_ID)



import requests
from django.db import IntegrityError
from models import Film, Genre, FilmAndGenre, Person, FilmRole, FilmsAndPersons, ProductionCompany, FilmAndProductionCompany, Country, FilmAndCountry, Language, FilmAndLanguage

# Configura tu API Key de TMDb
TMDB_API_KEY = 'ffb643bf7b157410e8ee164302dd9bd5'
TMDB_BASE_URL = 'https://api.themoviedb.org/3/'


# Función para obtener datos desde la API de TMDb
def get_tmdb_data(endpoint, params=None):
    if params is None:
        params = {}
    params['api_key'] = TMDB_API_KEY
    response = requests.get(TMDB_BASE_URL + endpoint, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error en la petición: {response.status_code}")
        return None


# Función para poblar la base de datos con películas
def populate_films():
    # Obtener datos de películas populares, por ejemplo
    data = get_tmdb_data('movie/popular', {'page': 1})
    if data:
        for film_data in data['results']:
            try:
                # Crear una película
                film = Film.objects.create(
                    film_id=film_data['id'],
                    title=film_data['title'],
                    release_year=film_data['release_date'][:4] if 'release_date' in film_data else None,
                    runtime=film_data.get('runtime', None),
                    synopsis=film_data.get('overview', ''),
                    budget=film_data.get('budget', None),
                    revenue=film_data.get('revenue', None),
                    status=film_data.get('status', ''),
                    tagline=film_data.get('tagline', ''),
                    poster_url=f"https://image.tmdb.org/t/p/w500{film_data['poster_path']}" if 'poster_path' in film_data else '',
                    backdrop_url=f"https://image.tmdb.org/t/p/w500{film_data['backdrop_path']}" if 'backdrop_path' in film_data else '',
                    active=True,
                    deleted=False
                )
                film.save()
                print(f"Película '{film.title}' añadida exitosamente.")

                # Poblar géneros de la película
                if 'genre_ids' in film_data:
                    for genre_id in film_data['genre_ids']:
                        genre_data = get_tmdb_data(f'genre/{genre_id}')
                        genre, created = Genre.objects.get_or_create(genre_id=genre_data['id'],
                                                                     genre_name=genre_data['name'])
                        FilmAndGenre.objects.create(film=film, genre=genre, active=True, deleted=False)

            except IntegrityError:
                print(f"Error al añadir la película {film_data['title']} a la base de datos.")


# Función para poblar personas (actores, directores, etc.)
def populate_persons():
    data = get_tmdb_data('person/popular', {'page': 1})
    if data:
        for person_data in data['results']:
            try:
                person = Person.objects.create(
                    person_id=person_data['id'],
                    name=person_data['name'],
                    biography=person_data.get('biography', ''),
                    place_of_birth=person_data.get('place_of_birth', ''),
                    birthday=person_data.get('birthday', None),
                    deathday=person_data.get('deathday', None),
                    picture_url=f"https://image.tmdb.org/t/p/w500{person_data['profile_path']}" if 'profile_path' in person_data else '',
                    alias=person_data.get('known_for_department', ''),
                    active=True,
                    deleted=False
                )
                person.save()
                print(f"Persona '{person.name}' añadida exitosamente.")
            except IntegrityError:
                print(f"Error al añadir la persona {person_data['name']}.")


# Función para poblar compañías de producción
def populate_production_companies():
    data = get_tmdb_data('movie/popular', {'page': 1})
    if data:
        for film_data in data['results']:
            for company_data in film_data.get('production_companies', []):
                try:
                    company, created = ProductionCompany.objects.get_or_create(
                        company_id=company_data['id'],
                        name=company_data['name'],
                        origin_country=company_data.get('origin_country', '')
                    )
                    FilmAndProductionCompany.objects.create(film_id=film_data['id'], company=company, active=True, deleted=False)
                except IntegrityError:
                    print(f"Error al añadir la compañía {company_data['name']}.")

# Función para poblar países
def populate_countries():
    data = get_tmdb_data('movie/popular', {'page': 1})
    if data:
        for film_data in data['results']:
            for country_data in film_data.get('production_countries', []):
                try:
                    country, created = Country.objects.get_or_create(
                        country_id=country_data['iso_3166_1'],
                        country_name=country_data['name']
                    )
                    FilmAndCountry.objects.create(film_id=film_data['id'], country=country, active=True, deleted=False)
                except IntegrityError:
                    print(f"Error al añadir el país {country_data['name']}.")

# Función para poblar idiomas
def populate_languages():
    data = get_tmdb_data('movie/popular', {'page': 1})
    if data:
        for film_data in data['results']:
            if 'original_language' in film_data:
                try:
                    language, created = Language.objects.get_or_create(
                        language_name=film_data['original_language'],
                        iso_639_1=film_data['original_language']
                    )
                    FilmAndLanguage.objects.create(film_id=film_data['id'], language=language, original_language=True, active=True, deleted=False)
                except IntegrityError:
                    print(f"Error al añadir el idioma {film_data['original_language']}.")

# Ejecutar las funciones para poblar la base de datos
def populate_database():
    populate_films()
    populate_persons()
    populate_production_companies()
    populate_countries()
    populate_languages()

if __name__ == '__main__':
    populate_database()
