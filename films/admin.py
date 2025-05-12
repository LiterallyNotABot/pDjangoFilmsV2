from django.contrib import admin
from films.models import *

admin.site.register(Film)
admin.site.register(Genre)
admin.site.register(FilmAndGenre)
admin.site.register(FilmRole)
admin.site.register(Person)
admin.site.register(FilmAndPerson)
admin.site.register(Country)
admin.site.register(Language)
admin.site.register(ProductionCompany)
admin.site.register(FilmAndLanguage)
admin.site.register(FilmAndCountry)
admin.site.register(FilmAndProductionCompany)