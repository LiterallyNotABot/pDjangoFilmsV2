from django.core.exceptions import ValidationError
from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from core.models import SoftDeleteModel, SoftManagedModel
from films.models import Film

User = get_user_model()


class Rating(SoftDeleteModel):
    rating_id = models.AutoField(primary_key=True)
    rating_value = models.DecimalField(
        max_digits=2,
        decimal_places=1,
        verbose_name="Rating Value"
    )

    class Meta:
        managed = True
        db_table = 'ratings'
        verbose_name = "Rating"
        verbose_name_plural = "Ratings"

    def clean(self):
        if not (0.5 <= self.rating_value <= 5):
            raise ValidationError("Rating value must be between 0.5 and 5.")


class Log(SoftManagedModel):
    log_id = models.AutoField(primary_key=True, verbose_name="Log ID")
    film = models.ForeignKey(Film, on_delete=models.CASCADE, verbose_name="Film")
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="User")
    rating = models.ForeignKey(Rating, on_delete=models.SET_NULL, blank=True, null=True, verbose_name="Rating")
    liked = models.BooleanField(default=False, verbose_name="Liked?")
    entry_date = models.DateTimeField(auto_now_add=True, verbose_name="Entry Date")

    class Meta:
        managed = True
        db_table = 'logs'
        verbose_name = "Log"
        verbose_name_plural = "Logs"


class Review(SoftManagedModel):
    review_id = models.AutoField(primary_key=True, verbose_name="Review ID")
    log = models.ForeignKey("reviews.Log", on_delete=models.CASCADE, verbose_name="Log")
    body = models.TextField(verbose_name="Review Body")
    entry_date = models.DateTimeField(default=timezone.now, verbose_name="Created at")

    class Meta:
        managed = True
        db_table = 'reviews'
        verbose_name = "Review"
        verbose_name_plural = "Reviews"


class ReviewAndLikeByUser(SoftDeleteModel):
    like_id = models.AutoField(primary_key=True, verbose_name="Like ID")
    log = models.ForeignKey(Log, on_delete=models.CASCADE, verbose_name="Log")
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="User")

    class Meta:
        managed = True
        db_table = 'reviewsandlikesbyuser'
        verbose_name = "Review and Like by User"
        verbose_name_plural = "Reviews and Likes by Users"
