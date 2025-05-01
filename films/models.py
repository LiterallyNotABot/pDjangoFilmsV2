from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone


class Film(models.Model):
    film_id = models.AutoField(primary_key=True, verbose_name="Film ID")
    title = models.CharField(max_length=255, verbose_name="Film Title")
    release_year = models.IntegerField(blank=True, null=True, verbose_name="Release Year")
    runtime = models.IntegerField(blank=True, null=True, verbose_name="Runtime (in minutes)")
    synopsis = models.TextField(blank=True, null=True, verbose_name="Synopsis")
    budget = models.BigIntegerField(blank=True, null=True, verbose_name="Budget")
    revenue = models.BigIntegerField(blank=True, null=True, verbose_name="Revenue")
    status = models.CharField(max_length=255, blank=True, null=True, verbose_name="Film Status")
    tagline = models.CharField(max_length=255, blank=True, null=True, verbose_name="Tagline")
    awards_and_nominations = models.CharField(max_length=255, blank=True, null=True, verbose_name="Awards and Nominations")
    poster_url = models.CharField(max_length=255, blank=True, null=True, verbose_name="Poster URL")
    backdrop_url = models.CharField(max_length=255, blank=True, null=True, verbose_name="Backdrop URL")
    popularity = models.DecimalField(max_digits=10, decimal_places=3, blank=True, null=True, verbose_name="Popularity Score")
    api_film_id = models.IntegerField(verbose_name="TMDb Film ID")
    last_synced = models.DateTimeField(null=True, blank=True, verbose_name="Last Synced")
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        managed = False
        db_table = 'films'
        verbose_name = "Film"
        verbose_name_plural = "Films"

        

    def save(self, *args, **kwargs):
        if self.last_synced and timezone.is_naive(self.last_synced):
            self.last_synced = timezone.make_aware(self.last_synced)
        if not self.last_synced:
            self.last_synced = timezone.now()
        super().save(*args, **kwargs)

    def clean(self):
        if self.runtime is not None and self.runtime < 0:
            raise ValidationError("Runtime cannot be negative.")

        if self.budget is not None and self.budget < 0:
            raise ValidationError("Budget cannot be negative.")

        if self.revenue is not None and self.revenue < 0:
            raise ValidationError("Revenue cannot be negative.")


class Genre(models.Model):
    genre_id = models.AutoField(primary_key=True, verbose_name="Genre ID")
    genre_name = models.CharField(unique=True, max_length=80, verbose_name="Genre Name")
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        managed = False
        db_table = 'genres'
        verbose_name = "Genre"
        verbose_name_plural = "Genres"

        

class FilmAndGenre(models.Model):
    film_genre_id = models.AutoField(primary_key=True)
    film = models.ForeignKey(Film, models.DO_NOTHING)
    genre = models.ForeignKey('Genre', models.DO_NOTHING)
    active = models.BooleanField(default=True)
    deleted = models.BooleanField(default=False)

    class Meta:
        managed = False
        db_table = 'filmsandgenres'
        verbose_name = "Film-Genre Relationship"
        verbose_name_plural = "Film-Genre Relationships"

        


class FilmRole(models.Model):
    role_id = models.AutoField(primary_key=True, verbose_name="Role ID")
    name = models.CharField(max_length=255, verbose_name="Role Name")
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        managed = False
        db_table = 'filmsroles'
        verbose_name = "Film Role"
        verbose_name_plural = "Film Roles"
        



class Person(models.Model):
    person_id = models.AutoField(primary_key=True, verbose_name="Person ID")
    name = models.CharField(max_length=255, verbose_name="Name")
    biography = models.TextField(blank=True, null=True, verbose_name="Biography")
    place_of_birth = models.CharField(max_length=255, blank=True, null=True, verbose_name="Place of Birth")
    birthday = models.DateField(blank=True, null=True, verbose_name="Birthday")
    deathday = models.DateField(blank=True, null=True, verbose_name="Deathday")
    picture_url = models.CharField(max_length=255, blank=True, null=True, verbose_name="Picture URL")
    alias = models.CharField(max_length=255, blank=True, null=True, verbose_name="Alias")
    api_person_id = models.IntegerField(verbose_name="TMDb Person ID")
    last_synced = models.DateTimeField(null=True, blank=True, verbose_name="Last Synced")
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    def save(self, *args, **kwargs):
        if self.last_synced and timezone.is_naive(self.last_synced):
            self.last_synced = timezone.make_aware(self.last_synced)
        if not self.last_synced:
            self.last_synced = timezone.now()
        super().save(*args, **kwargs)

    class Meta:
        managed = False
        db_table = 'persons'
        verbose_name = "Person"
        verbose_name_plural = "Persons"

        

class FilmAndPerson(models.Model):
    record_id = models.AutoField(primary_key=True, verbose_name="Record ID")
    person = models.ForeignKey('Person', on_delete=models.DO_NOTHING, verbose_name="Person")
    film = models.ForeignKey(Film, on_delete=models.DO_NOTHING, verbose_name="Film")
    role = models.ForeignKey('FilmRole', on_delete=models.DO_NOTHING, verbose_name="Role")
    character = models.CharField(max_length=255, blank=True, null=True, verbose_name="Character")
    display_order = models.IntegerField(blank=True, null=True, verbose_name="Display Order")
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        managed = False
        db_table = 'filmsandpersons'
        verbose_name = "Film and Person Record"
        verbose_name_plural = "Film and Person Records"

        


class ProductionCompany(models.Model):
    company_id = models.AutoField(primary_key=True, verbose_name="Company ID")
    name = models.CharField(max_length=255, verbose_name="Company Name")
    origin_country = models.CharField(max_length=255, blank=True, null=True, verbose_name="Origin Country")
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        managed = False
        db_table = 'productioncompanies'
        verbose_name = "Production Company"
        verbose_name_plural = "Production Companies"

        

class FilmAndProductionCompany(models.Model):
    record_id = models.AutoField(primary_key=True, verbose_name="Record ID")
    film = models.ForeignKey(Film, on_delete=models.CASCADE, verbose_name="Film")
    company = models.ForeignKey('ProductionCompany', on_delete=models.CASCADE, verbose_name="Production Company")
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        managed = False
        db_table = 'filmsandproductioncompanies'
        verbose_name = "Film and Production Company"
        verbose_name_plural = "Films and Production Companies"

        

class Country(models.Model):
    country_id = models.AutoField(primary_key=True, verbose_name="Country ID")
    country_name = models.CharField(unique=True, max_length=255, verbose_name="Country Name")
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        managed = False
        db_table = 'countries'
        verbose_name = "Country"
        verbose_name_plural = "Countries"

        

class FilmAndCountry(models.Model):
    record_id = models.AutoField(primary_key=True)
    film = models.ForeignKey(Film, on_delete=models.CASCADE, verbose_name="Film")
    country = models.ForeignKey(Country, on_delete=models.CASCADE, verbose_name="Country")
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        managed = False
        db_table = 'filmsandcountries'
        verbose_name = "Film-Country Relationship"
        verbose_name_plural = "Film-Country Relationships"

        


class Language(models.Model):
    language_id = models.AutoField(primary_key=True)
    language_name = models.CharField(unique=True, max_length=255, verbose_name="Language Name")
    iso_639_1 = models.CharField(unique=True, max_length=10, verbose_name="ISO 639-1 Code")
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        managed = False
        db_table = 'languages'
        verbose_name = "Language"
        verbose_name_plural = "Languages"

        

class FilmAndLanguage(models.Model):
    record_id = models.AutoField(primary_key=True)
    film = models.ForeignKey(Film, on_delete=models.DO_NOTHING)
    language = models.ForeignKey('Language', on_delete=models.DO_NOTHING)
    original_language = models.BooleanField(default=False, verbose_name="Is Original Language?")
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        managed = False
        db_table = 'filmsandlanguages'
        verbose_name = "Film-Language Relationship"
        verbose_name_plural = "Film-Language Relationships"

        