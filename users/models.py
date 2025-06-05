from cloudinary.models import CloudinaryField
from django.db import models
from django.contrib.auth import get_user_model
from core.models import SoftDeleteModel, SoftManagedModel, SoftCreateModel
from films.models import Film
from reviews.models import Rating

User = get_user_model()


class Follower(SoftDeleteModel):
    record_id = models.AutoField(primary_key=True, verbose_name="Follower ID")
    follower_user = models.ForeignKey(User, on_delete=models.DO_NOTHING, verbose_name="Follower User")
    followed_user = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name='followers_followed_set', verbose_name="Followed User")
    date_followed = models.DateTimeField(verbose_name="Date Followed")



class FilmAndUser(SoftCreateModel):
    film_and_user_id = models.AutoField(primary_key=True, verbose_name="Film and User ID")
    film = models.ForeignKey(Film, on_delete=models.CASCADE, verbose_name="Film")
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="User")
    rating = models.ForeignKey(Rating, on_delete=models.SET_NULL, blank=True, null=True, verbose_name="Rating")
    watched = models.BooleanField(default=True, verbose_name="Watched?")
    liked = models.BooleanField(default=False, verbose_name="Liked?")

    class Meta:
        managed = True
        db_table = 'filmsAndUsers'
        verbose_name = "Film and User Relationship"
        verbose_name_plural = "Film and User Relationships"
        constraints = [
            models.UniqueConstraint(fields=["user", "film"], name="unique_user_film_interaction")
        ]

    def should_soft_delete(self):
        return not self.watched and not self.liked and self.rating is None



class List(SoftManagedModel):
    list_id = models.AutoField(primary_key=True, verbose_name="List ID")
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="User")
    list_name = models.CharField(max_length=100, verbose_name="List Name")
    list_description = models.TextField(blank=True, null=True, verbose_name="List Description")
    date_of_creation = models.DateTimeField(auto_now_add=True, verbose_name="Date of Creation")

    class Meta:
        managed = True
        db_table = 'lists'
        verbose_name = "List"
        verbose_name_plural = "Lists"

    def __str__(self):
        return self.list_name


class Watchlist(SoftDeleteModel):
    entry_id = models.AutoField(primary_key=True, verbose_name="Entry ID")
    film = models.ForeignKey(Film, on_delete=models.DO_NOTHING, verbose_name="Film")
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING, verbose_name="User")
    date_added = models.DateTimeField(verbose_name="Date Added", auto_now_add=True)

    class Meta:
        managed = True
        db_table = 'watchlists'
        verbose_name = "Watchlist Entry"
        verbose_name_plural = "Watchlist Entries"
        unique_together = (("film", "user"),)

class ListAndFilm(SoftManagedModel):
    list_film_id = models.AutoField(primary_key=True, verbose_name="List Film ID")
    list = models.ForeignKey(List, on_delete=models.DO_NOTHING, verbose_name="List")
    film = models.ForeignKey(Film, on_delete=models.DO_NOTHING, verbose_name="Film")
    sort_order = models.IntegerField(blank=True, null=True, verbose_name="Sort Order")

    class Meta:
        managed = True
        db_table = 'listsandfilms'
        verbose_name = "List-Film Relationship"
        verbose_name_plural = "List-Film Relationships"
        unique_together = (('list', 'film', 'sort_order'),)


class ListAndLikeByUser(SoftDeleteModel):
    like_id = models.AutoField(primary_key=True, verbose_name="Like ID")
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING, verbose_name="User")
    list = models.ForeignKey(List, on_delete=models.DO_NOTHING, verbose_name="List")

    class Meta:
        managed = True
        db_table = 'listsandlikesbyusers'
        verbose_name = "List Like by User"
        verbose_name_plural = "List Likes by Users"


class UserProfile(SoftDeleteModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    avatar = CloudinaryField('avatar', blank=True, null=True)
    location = models.CharField(max_length=100, blank=True)
    website = models.URLField(blank=True)
    given_name = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)

    def __str__(self):
        return self.user.username


class FavoriteFilm(SoftDeleteModel):
    profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="favorite_entries")
    film = models.ForeignKey(Film, on_delete=models.CASCADE)
    rank = models.PositiveSmallIntegerField()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["profile", "rank"], name="unique_favorite_rank"),
            models.UniqueConstraint(fields=["profile", "film"], name="unique_favorite_film"),
        ]
        ordering = ["rank"]

    def __str__(self):
        return f"{self.profile.user.username} - #{self.rank} - {self.film}"
