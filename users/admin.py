from django.contrib import admin

from users.models import Follower, FilmAndUser, ListAndFilm, List, Watchlist, ListAndLikeByUser

admin.site.register(Follower)
admin.site.register(FilmAndUser)
admin.site.register(List)
admin.site.register(ListAndFilm)
admin.site.register(Watchlist)
admin.site.register(ListAndLikeByUser)