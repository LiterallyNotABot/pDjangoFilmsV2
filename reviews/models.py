from django.core.exceptions import ValidationError
from django.db import models
from django.contrib.auth import get_user_model
from films.models import Film
User = get_user_model()

class Rating(models.Model):
    rating_id = models.AutoField(primary_key=True)
    rating_value = models.DecimalField(
        max_digits=2,
        decimal_places=1,
        verbose_name="Rating Value"
    )
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        managed = True
        db_table = 'ratings'
        verbose_name = "Rating"
        verbose_name_plural = "Ratings"

    def clean(self):
        if not (0.5 <= self.rating_value <= 5):
            raise ValidationError("Rating value must be between 0.5 and 5.")


class Log(models.Model):
    log_id = models.AutoField(primary_key=True, verbose_name="Log ID")
    film = models.ForeignKey(Film, on_delete=models.CASCADE, verbose_name="Film")
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="User")
    rating = models.ForeignKey(Rating, on_delete=models.SET_NULL, blank=True, null=True, verbose_name="Rating")
    liked = models.BooleanField(default=False, verbose_name="Liked?")
    entry_date = models.DateTimeField(auto_now_add=True, verbose_name="Entry Date")
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        managed = True
        db_table = 'logs'
        verbose_name = "Log"
        verbose_name_plural = "Logs"


class Review(models.Model):
    review_id = models.AutoField(primary_key=True, verbose_name="Review ID")
    log = models.ForeignKey(Log, on_delete=models.CASCADE, verbose_name="Log")
    body = models.TextField(verbose_name="Review Body")
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        managed = True
        db_table = 'reviews'
        verbose_name = "Review"
        verbose_name_plural = "Reviews"


class ReviewAndLikeByUser(models.Model):
    like_id = models.AutoField(primary_key=True, verbose_name="Like ID")
    log = models.ForeignKey(Log, on_delete=models.CASCADE, verbose_name="Log")
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="User")
    active = models.BooleanField(default=True, verbose_name="Is Active?")
    deleted = models.BooleanField(default=False, verbose_name="Is Deleted?")

    class Meta:
        managed = True
        db_table = 'reviewsandlikesbyuser'
        verbose_name = "Review and Like by User"
        verbose_name_plural = "Reviews and Likes by Users"
