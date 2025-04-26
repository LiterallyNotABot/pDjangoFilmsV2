# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.core.exceptions import ValidationError
from django.db import models

##### AUTH CLASSES ###########################

class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'
        app_label = 'pDjangoFilmsV2'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)
        app_label = 'pDjangoFilmsV2'



class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)
        app_label = 'pDjangoFilmsV2'



class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'
        app_label = 'pDjangoFilmsV2'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)
        app_label = 'pDjangoFilmsV2'


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)
        app_label = 'pDjangoFilmsV2'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.SmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'
        app_label = 'films'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)
        app_label = 'films'


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'
        app_label = 'films'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'
        app_label = 'films'

##### NOT AUTH CLASSES ###########################

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
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        managed = False
        db_table = 'films'
        verbose_name = "Film"
        verbose_name_plural = "Films"

        app_label = 'films'


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

        app_label = 'films'

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

        app_label = 'films'


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
        app_label = 'films'



class Person(models.Model):
    person_id = models.AutoField(primary_key=True, verbose_name="Person ID")
    name = models.CharField(max_length=255, verbose_name="Name")
    biography = models.TextField(blank=True, null=True, verbose_name="Biography")
    place_of_birth = models.CharField(max_length=255, blank=True, null=True, verbose_name="Place of Birth")
    birthday = models.DateField(blank=True, null=True, verbose_name="Birthday")
    deathday = models.DateField(blank=True, null=True, verbose_name="Deathday")
    picture_url = models.CharField(max_length=255, blank=True, null=True, verbose_name="Picture URL")
    alias = models.CharField(max_length=255, blank=True, null=True, verbose_name="Alias")
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        managed = False
        db_table = 'persons'
        verbose_name = "Person"
        verbose_name_plural = "Persons"

        app_label = 'films'

class FilmsAndPersons(models.Model):
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

        app_label = 'films'


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

        app_label = 'films'

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

        app_label = 'films'

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

        app_label = 'films'

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

        app_label = 'films'


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

        app_label = 'films'

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

        app_label = 'films'


class Rating(models.Model):
    pk = models.AutoField(primary_key=True)
    rating_value = models.DecimalField(
        max_digits=2,
        decimal_places=1,
        verbose_name="Rating Value"
    )
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        managed = False
        db_table = 'ratings'
        verbose_name = "Rating"
        verbose_name_plural = "Ratings"

        app_label = 'films'

    def clean(self):
        if not (0.5 <= self.rating_value <= 5):
            raise ValidationError("Rating value must be between 0.5 and 5.")


class List(models.Model):
    list_id = models.AutoField(primary_key=True, verbose_name="List ID")
    user = models.ForeignKey(AuthUser, on_delete=models.CASCADE, verbose_name="User")
    list_name = models.CharField(max_length=100, verbose_name="List Name")
    list_description = models.TextField(blank=True, null=True, verbose_name="List Description")
    date_of_creation = models.DateTimeField(auto_now_add=True, verbose_name="Date of Creation")
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        managed = False
        db_table = 'lists'
        verbose_name = "List"
        verbose_name_plural = "Lists"

        app_label = 'films'

    def __str__(self):
        return self.list_name

class Watchlist(models.Model):
    entry_id = models.AutoField(primary_key=True, verbose_name="Entry ID")
    film = models.ForeignKey(Film, on_delete=models.DO_NOTHING, verbose_name="Film")
    user = models.ForeignKey(AuthUser, on_delete=models.DO_NOTHING, verbose_name="User")
    date_added = models.DateTimeField(verbose_name="Date Added", auto_now_add=True)
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        managed = False
        db_table = 'watchlists'
        verbose_name = "Watchlist"
        verbose_name_plural = "Watchlists"

        app_label = 'films'


class ListAndFilm(models.Model):
    list_film_id = models.AutoField(primary_key=True, verbose_name="List Film ID")
    list = models.ForeignKey(List, on_delete=models.DO_NOTHING, verbose_name="List")
    film = models.ForeignKey(Film, on_delete=models.DO_NOTHING, verbose_name="Film")
    sort_order = models.IntegerField(blank=True, null=True, verbose_name="Sort Order")
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        managed = False
        db_table = 'listsandfilms'
        verbose_name = "List-Film Relationship"
        verbose_name_plural = "List-Film Relationships"
        unique_together = (('list', 'film', 'sort_order'),)

        app_label = 'films'

class FilmAndUser(models.Model):
    film_and_user_id = models.AutoField(primary_key=True, verbose_name="Film and User ID")
    film = models.ForeignKey(Film, on_delete=models.CASCADE, verbose_name="Film")
    user = models.ForeignKey(AuthUser, on_delete=models.CASCADE, verbose_name="User")
    rating = models.ForeignKey('Rating', on_delete=models.SET_NULL, blank=True, null=True, verbose_name="Rating")
    watched = models.BooleanField(default=True, verbose_name="Watched?")
    liked = models.BooleanField(default=False, verbose_name="Liked?")
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        managed = False
        db_table = 'filmsAndUsers'
        verbose_name = "Film and User Relationship"
        verbose_name_plural = "Film and User Relationships"

        app_label = 'films'

class Log(models.Model):
    log_id = models.AutoField(primary_key=True, verbose_name="Log ID")
    film = models.ForeignKey(Film, on_delete=models.CASCADE, verbose_name="Film")
    user = models.ForeignKey(AuthUser, on_delete=models.CASCADE, verbose_name="User")
    rating = models.ForeignKey('Rating', on_delete=models.SET_NULL, blank=True, null=True, verbose_name="Rating")
    liked = models.BooleanField(default=False, verbose_name="Liked?")
    entry_date = models.DateTimeField(auto_now_add=True, verbose_name="Entry Date")
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        managed = False
        db_table = 'logs'
        verbose_name = "Log"
        verbose_name_plural = "Logs"

        app_label = 'films'

class Review(models.Model):
    review_id = models.AutoField(primary_key=True, verbose_name="Review ID")
    log = models.ForeignKey(Log, on_delete=models.CASCADE, verbose_name="Log")
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        managed = False
        db_table = 'reviews'
        verbose_name = "Review"
        verbose_name_plural = "Reviews"

        app_label = 'films'

class ReviewAndLikeByUser(models.Model):
    like_id = models.AutoField(primary_key=True, verbose_name="Like ID")
    log = models.ForeignKey(Log, on_delete=models.CASCADE, verbose_name="Log")
    user = models.ForeignKey(AuthUser, on_delete=models.CASCADE, verbose_name="User")
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        managed = False
        db_table = 'reviewsandlikesbyuser'
        verbose_name = "Review and Like by User"
        verbose_name_plural = "Reviews and Likes by Users"

        app_label = 'films'


class Comment(models.Model):
    comment_id = models.AutoField(primary_key=True, verbose_name="Comment ID")
    user = models.ForeignKey(AuthUser, on_delete=models.CASCADE, verbose_name="User")
    film = models.ForeignKey('Film', on_delete=models.CASCADE, verbose_name="Film")
    parent_comment = models.ForeignKey('self', on_delete=models.CASCADE, blank=True, null=True, verbose_name="Parent Comment")
    body = models.TextField(verbose_name="Comment Body")
    creation_date = models.DateTimeField(verbose_name="Creation Date")
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        managed = False
        db_table = 'comments'
        verbose_name = "Comment"
        verbose_name_plural = "Comments"

        app_label = 'films'


class CommentAndLikeByUser(models.Model):
    like_id = models.AutoField(primary_key=True, verbose_name="Like ID")
    comment = models.ForeignKey(Comment, on_delete=models.DO_NOTHING, verbose_name="Comment")
    user = models.ForeignKey(AuthUser, on_delete=models.DO_NOTHING, verbose_name="User")
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        managed = False
        db_table = 'commentsandlikesbyuser'
        verbose_name = "Comment and Like by User"
        verbose_name_plural = "Comments and Likes by Users"

        app_label = 'films'


class Follower(models.Model):
    record_id = models.AutoField(primary_key=True, verbose_name="Follower ID")
    follower_user = models.ForeignKey(AuthUser, on_delete=models.DO_NOTHING, verbose_name="Follower User")
    followed_user = models.ForeignKey(AuthUser, on_delete=models.DO_NOTHING, related_name='followers_followed_set', verbose_name="Followed User")
    date_followed = models.DateTimeField(verbose_name="Date Followed")
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        managed = False
        db_table = 'followers'
        verbose_name = "Follower Relationship"
        verbose_name_plural = "Follower Relationships"

        app_label = 'films'


class ListAndLikeByUser(models.Model):
    like_id = models.AutoField(primary_key=True, verbose_name="Like ID")
    user = models.ForeignKey(AuthUser, on_delete=models.DO_NOTHING, verbose_name="User")
    list = models.ForeignKey(List, on_delete=models.DO_NOTHING, verbose_name="List")
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        managed = False
        db_table = 'listsandlikesbyusers'
        verbose_name = "List Like by User"
        verbose_name_plural = "List Likes by Users"

        app_label = 'films'



class PrivateConversation(models.Model):
    conversation_id = models.AutoField(primary_key=True, verbose_name="Conversation ID")
    creator = models.ForeignKey(AuthUser, on_delete=models.DO_NOTHING, verbose_name="Creator")
    target = models.ForeignKey(AuthUser, on_delete=models.DO_NOTHING, related_name='private_conversation_target_set', verbose_name="Target User")
    subject = models.CharField(max_length=255, blank=True, null=True, verbose_name="Subject")
    date_created = models.DateTimeField(verbose_name="Date Created")
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        managed = False
        db_table = 'privateconversation'
        verbose_name = "Private Conversation"
        verbose_name_plural = "Private Conversations"

        app_label = 'films'


class PrivateMessage(models.Model):
    message_id = models.AutoField(primary_key=True, verbose_name="Message ID")
    conversation = models.ForeignKey(PrivateConversation, on_delete=models.DO_NOTHING, verbose_name="Conversation")
    sender = models.ForeignKey(AuthUser, on_delete=models.DO_NOTHING, verbose_name="Sender")
    content = models.TextField(verbose_name="Message Content")
    date_sent = models.DateTimeField(verbose_name="Date Sent")
    read_status = models.BooleanField(default=False, verbose_name="Read Status")
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        managed = False
        db_table = 'privatemessages'
        verbose_name = "Private Message"
        verbose_name_plural = "Private Messages"

        app_label = 'films'

