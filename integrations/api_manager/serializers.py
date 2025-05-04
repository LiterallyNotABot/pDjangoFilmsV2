from rest_framework import serializers

from films.models import *


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['genre_id', 'genre_name']

class ProductionCompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductionCompany
        fields = ['company_id', 'name', 'origin_country']

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['country_id', 'country_name']

class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ['language_id', 'language_name', 'iso_639_1']

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ['person_id', 'name', 'picture_url', 'alias']

class FilmRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = FilmRole
        fields = ['role_id', 'name']

class CrewMemberSerializer(serializers.ModelSerializer):
    person = PersonSerializer()
    role = FilmRoleSerializer()

    class Meta:
        model = FilmAndPerson
        fields = ['person', 'role', 'character']

class FilmSerializer(serializers.ModelSerializer):
    genres = serializers.SerializerMethodField()
    production_companies = serializers.SerializerMethodField()
    countries = serializers.SerializerMethodField()
    languages = serializers.SerializerMethodField()
    crew = serializers.SerializerMethodField()

    class Meta:
        model = Film
        fields = [
            'film_id', 'title', 'release_year', 'runtime', 'synopsis', 'budget',
            'revenue', 'status', 'tagline', 'awards_and_nominations', 'poster_url',
            'backdrop_url', 'popularity', 'api_film_id', 'last_synced',
            'genres', 'production_companies', 'countries', 'languages', 'crew'
        ]

    def get_genres(self, obj):
        qs = FilmAndGenre.objects.filter(film=obj, active=True, deleted=False).select_related('genre')
        return GenreSerializer([fg.genre for fg in qs if fg.genre.active and not fg.genre.deleted], many=True).data

    def get_production_companies(self, obj):
        qs = FilmAndProductionCompany.objects.filter(film=obj, active=True, deleted=False).select_related('company')
        return ProductionCompanySerializer([fp.company for fp in qs if fp.company.active and not fp.company.deleted], many=True).data

    def get_countries(self, obj):
        qs = FilmAndCountry.objects.filter(film=obj, active=True, deleted=False).select_related('country')
        return CountrySerializer([fc.country for fc in qs if fc.country.active and not fc.country.deleted], many=True).data

    def get_languages(self, obj):
        qs = FilmAndLanguage.objects.filter(film=obj, active=True, deleted=False).select_related('language')
        return LanguageSerializer([fl.language for fl in qs if fl.language.active and not fl.language.deleted], many=True).data

    def get_crew(self, obj):
        qs = FilmAndPerson.objects.filter(film=obj, active=True, deleted=False).select_related('person', 'role')
        return CrewMemberSerializer(qs, many=True).data
