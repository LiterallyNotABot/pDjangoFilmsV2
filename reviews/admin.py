from django.contrib import admin
from reviews.models import Rating, Log, Review, ReviewAndLikeByUser

admin.site.register(Rating)
admin.site.register(Log)
admin.site.register(Review)
admin.site.register(ReviewAndLikeByUser)