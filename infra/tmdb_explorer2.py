import os
from django.conf import settings
# from django.contrib.sites import requests
import requests

from django.db import IntegrityError

# Asegúrate de que la variable DJANGO_SETTINGS_MODULE esté configurada correctamente
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pDjangoFilmsV2.settings')  # Cambia 'tu_proyecto.settings' por el nombre de tu archivo settings.py

# Luego inicializa Django
import django
django.setup()

# Ahora puedes importar tus modelos
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

                # Poblar géneros de la película
                if 'genre_ids' in film_data:
                    for genre_id in film_data['genre_ids']:
                        genre_data = get_tmdb_data(f'genre/{genre_id}')
                        if genre_data:
                            genre, created = Genre.objects.get_or_create(genre_id=genre_data['id'], genre_name=genre_data['name'])
                            FilmAndGenre.objects.create(film=film, genre=genre, active=True, deleted=False)

                print(f"Película '{film.title}' añadida exitosamente.")

            except IntegrityError as e:
                print(f"Error al añadir la película {film_data['title']}: {e}")
            except Exception as e:
                print(f"Error inesperado al añadir la película {film_data['title']}: {e}")


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
                print(f"Persona '{person.name}' añadida exitosamente.")
            except IntegrityError as e:
                print(f"Error al añadir la persona {person_data['name']}: {e}")
            except Exception as e:
                print(f"Error inesperado al añadir la persona {person_data['name']}: {e}")


# Función para poblar compañías de producción
def populate_production_companies():
    data = get_tmdb_data('movie/popular', {'page': 1})
    if data:
        print(data)
        for film_data in data['results']:
            for company_data in film_data.get('production_companies', []):
                try:
                    company, created = ProductionCompany.objects.get_or_create(
                        company_id=company_data['id'],
                        name=company_data['name'],
                        origin_country=company_data.get('origin_country', '')
                    )
                    FilmAndProductionCompany.objects.create(film_id=film_data['id'], company=company, active=True, deleted=False)
                except IntegrityError as e:
                    print(f"Error al añadir la compañía {company_data['name']}: {e}")
                except Exception as e:
                    print(f"Error inesperado al añadir la compañía {company_data['name']}: {e}")


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
                except IntegrityError as e:
                    print(f"Error al añadir el país {country_data['name']}: {e}")
                except Exception as e:
                    print(f"Error inesperado al añadir el país {country_data['name']}: {e}")


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
                except IntegrityError as e:
                    print(f"Error al añadir el idioma {film_data['original_language']}: {e}")
                except Exception as e:
                    print(f"Error inesperado al añadir el idioma {film_data['original_language']}: {e}")


# Ejecutar las funciones para poblar la base de datos
def populate_database():
   # populate_films()
   # populate_persons()
    populate_production_companies()
    populate_countries()
    populate_languages()


if __name__ == '__main__':
    populate_database()