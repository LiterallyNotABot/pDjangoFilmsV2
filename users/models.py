from django.db import models
from django.contrib.auth import get_user_model

from films.models import Film
from reviews.models import Rating

User = get_user_model()


class Follower(models.Model):
    record_id = models.AutoField(primary_key=True, verbose_name="Follower ID")
    follower_user = models.ForeignKey(User, on_delete=models.DO_NOTHING, verbose_name="Follower User")
    followed_user = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name='followers_followed_set',
                                      verbose_name="Followed User")
    date_followed = models.DateTimeField(verbose_name="Date Followed")
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")


class FilmAndUser(models.Model):
    film_and_user_id = models.AutoField(primary_key=True, verbose_name="Film and User ID")
    film = models.ForeignKey(Film, on_delete=models.CASCADE, verbose_name="Film")
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="User")
    rating = models.ForeignKey(Rating, on_delete=models.SET_NULL, blank=True, null=True, verbose_name="Rating")
    watched = models.BooleanField(default=True, verbose_name="Watched?")
    liked = models.BooleanField(default=False, verbose_name="Liked?")
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        managed = True
        db_table = 'filmsAndUsers'
        verbose_name = "Film and User Relationship"
        verbose_name_plural = "Film and User Relationships"


class List(models.Model):
    list_id = models.AutoField(primary_key=True, verbose_name="List ID")
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="User")
    list_name = models.CharField(max_length=100, verbose_name="List Name")
    list_description = models.TextField(blank=True, null=True, verbose_name="List Description")
    date_of_creation = models.DateTimeField(auto_now_add=True, verbose_name="Date of Creation")
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        managed = True
        db_table = 'lists'
        verbose_name = "List"
        verbose_name_plural = "Lists"

    def __str__(self):
        return self.list_name


class Watchlist(models.Model):
    entry_id = models.AutoField(primary_key=True, verbose_name="Entry ID")
    film = models.ForeignKey(Film, on_delete=models.DO_NOTHING, verbose_name="Film")
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING, verbose_name="User")
    date_added = models.DateTimeField(verbose_name="Date Added", auto_now_add=True)
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        managed = True
        db_table = 'watchlists'
        verbose_name = "Watchlist"
        verbose_name_plural = "Watchlists"


class ListAndFilm(models.Model):
    list_film_id = models.AutoField(primary_key=True, verbose_name="List Film ID")
    list = models.ForeignKey(List, on_delete=models.DO_NOTHING, verbose_name="List")
    film = models.ForeignKey(Film, on_delete=models.DO_NOTHING, verbose_name="Film")
    sort_order = models.IntegerField(blank=True, null=True, verbose_name="Sort Order")
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        managed = True
        db_table = 'listsandfilms'
        verbose_name = "List-Film Relationship"
        verbose_name_plural = "List-Film Relationships"
        unique_together = (('list', 'film', 'sort_order'),)


class ListAndLikeByUser(models.Model):
    like_id = models.AutoField(primary_key=True, verbose_name="Like ID")
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING, verbose_name="User")
    list = models.ForeignKey(List, on_delete=models.DO_NOTHING, verbose_name="List")
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        managed = True
        db_table = 'listsandlikesbyusers'
        verbose_name = "List Like by User"
        verbose_name_plural = "List Likes by Users"