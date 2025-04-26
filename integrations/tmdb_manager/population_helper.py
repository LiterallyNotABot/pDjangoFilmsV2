import os
import sys

from integrations.tmdb_manager.language_helper import iso_639_1_to_fullname
from integrations.tmdb_manager.tmdb_connector import get_person_details

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from  models import Film, Genre, FilmAndGenre, Person, FilmRole, FilmsAndPersons, ProductionCompany, FilmAndProductionCompany, Language, FilmAndLanguage, Country, FilmAndCountry


def insert_or_update_film(film_data):
    film, created = Film.objects.update_or_create(
        title=film_data['title'],
        release_year=film_data.get('release_year'),
        defaults={
            'runtime': film_data.get('runtime'),
            'synopsis': film_data.get('synopsis'),
            'budget': film_data.get('budget'),
            'revenue': film_data.get('revenue'),
            'status': film_data.get('status'),
            'tagline': film_data.get('tagline'),
            'poster_url': film_data.get('poster_url'),
            'backdrop_url': film_data.get('backdrop_url'),
            'active': True,
            'deleted': False,
        }
    )
    return film

def insert_genres(film, genres):
    for genre_data in genres:
        genre, _ = Genre.objects.get_or_create(
            genre_name=genre_data['name'],
            defaults={'active': True, 'deleted': False}
        )
        FilmAndGenre.objects.get_or_create(film=film, genre=genre)

def insert_people_and_roles(film, cast_list, crew_list):
    for person_data in cast_list + crew_list:
        person_id = person_data.get('id')
        if not person_id:
            continue  # Si no hay ID, no podemos buscar más info

        try:
            detailed_person = get_person_details(person_id)
            # time.sleep(0.25)  # respetar límite de TMDB
        except Exception as e:
            print(f"Error fetching details for person {person_data.get('name')}: {e}")
            detailed_person = {}

        person, created = Person.objects.update_or_create(
            name=detailed_person.get('name', person_data['name']),
            defaults={
                'biography': detailed_person.get('biography') or '',
                'place_of_birth': detailed_person.get('place_of_birth') or '',
                'birthday': detailed_person.get('birthday') or None,
                'deathday': detailed_person.get('deathday') or None,
                'picture_url': f"https://image.tmdb.org/t/p/original{detailed_person['profile_path']}" if detailed_person.get('profile_path') else '',
                'alias': detailed_person.get('also_known_as')[0] if detailed_person.get('also_known_as') else '',
                'active': True,
                'deleted': False
            }
        )

        role_name = person_data.get('job') or 'Actor'
        role, _ = FilmRole.objects.get_or_create(
            name=role_name,
            defaults={'active': True, 'deleted': False}
        )

        FilmsAndPersons.objects.get_or_create(
            person=person,
            film=film,
            role=role,
            character=person_data.get('character')
        )

def insert_production_companies(film, companies):
    for company_data in companies:
        company, _ = ProductionCompany.objects.get_or_create(
            name=company_data['name'],
            defaults={'origin_country': company_data.get('origin_country', ''),
                      'active': True, 'deleted': False}
        )
        FilmAndProductionCompany.objects.get_or_create(film=film, company=company)


def insert_countries(film, countries):
    for country_data in countries:
        country, _ = Country.objects.get_or_create(
            country_name=country_data['name'],
            defaults={'active': True, 'deleted': False}
        )
        FilmAndCountry.objects.get_or_create(film=film, country=country)


def insert_languages(film, languages, original_language_code=None):
    for language_data in languages:
        iso_code = language_data.get('iso_639_1')
        language_name = language_data.get('name')

        # Evitar problemas: si name viene como ISO, intenta mapearlo
        if len(language_name) <= 3:  # si es muy corto tipo "EN"
            language_name = iso_639_1_to_fullname(iso_code)

        language, _ = Language.objects.get_or_create(
            iso_639_1=iso_code,
            defaults={
                'language_name': language_name,
                'active': True,
                'deleted': False
            }
        )
        FilmAndLanguage.objects.get_or_create(
            film=film,
            language=language,
            original_language=(language.iso_639_1 == original_language_code)
        )
