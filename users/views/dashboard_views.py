from decimal import Decimal

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model

from reviews.models import Review, Log
from users.models import FavoriteFilm, Watchlist, FilmAndUser
from users.serializers.film_and_user_serializer import FilmAndUserSerializer
from users.serializers.user_serializer import PublicUserSerializer
from films.serializers.mini_film_serializer import MiniFilmSerializer
from reviews.serializers.reviews_feed_serializer import ReviewWithFilmSerializer

User = get_user_model()


class UserProfileView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, username):
        user = get_object_or_404(User, username=username)
        return Response(PublicUserSerializer(user, context={"request": request}).data)


class UserFavoriteFilmsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, username):
        user = get_object_or_404(User, username=username)
        favorites = FavoriteFilm.objects.filter(profile__user=user).select_related("film")[:4]
        films = [fav.film for fav in favorites]
        return Response(MiniFilmSerializer(films, many=True, context={"request": request}).data)


class UserWatchlistView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, username):
        user = get_object_or_404(User, username=username)
        entries = Watchlist.objects.filter(user=user).select_related("film").order_by("-date_added")[:4]
        films = [entry.film for entry in entries]
        return Response(MiniFilmSerializer(films, many=True, context={"request": request}).data)


class UserRecentActivityView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, username):
        user = get_object_or_404(User, username=username)
        logs = (
            Log.objects
            .filter(user=user)
            .select_related("film")
            .order_by("-entry_date")[:4]
        )
        films = [log.film for log in logs]
        return Response(MiniFilmSerializer(films, many=True, context={"request": request}).data)



class UserReviewsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, username):
        user = get_object_or_404(User, username=username)
        reviews = Review.objects.filter(log__user=user).select_related("log__film").order_by("-entry_date")[:10]
        return Response(ReviewWithFilmSerializer(reviews, many=True, context={"request": request}).data)


class UserRatingStatsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, username):
        user = get_object_or_404(User, username=username)
        reviews = Review.objects.filter(log__user=user)
        ratings = reviews.values_list("log__rating__rating_value", flat=True)

        valid_ratings = [r for r in ratings if r is not None]
        count = len(valid_ratings)
        total = sum(valid_ratings, Decimal("0.0")) if count else Decimal("0.0")
        average = total / count if count else 0

        distribution = {}
        for val in valid_ratings:
            val_str = str(val)
            distribution[val_str] = distribution.get(val_str, 0) + 1

        return Response({
            "average": round(average, 2),
            "count": count,
            "distribution": distribution
        })


class UserDashboardDataView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, username):
        user = get_object_or_404(User, username=username)
        profile_data = PublicUserSerializer(user, context={"request": request}).data

        favorites_qs = FavoriteFilm.objects.filter(profile__user=user).select_related("film")[:4]
        favorites = MiniFilmSerializer(
            [fav.film for fav in favorites_qs if fav.film],
            many=True,
            context={"request": request}
        ).data

        logs = Log.objects.filter(user=user).select_related("film").order_by("-entry_date")[:4]
        activity_films = [log.film for log in logs if log.film and hasattr(log.film, "pk")]

        film_ids = [film.pk for film in activity_films]

        if request.user.is_authenticated:
            user_activity = FilmAndUser.objects.filter(user=request.user, film_id__in=film_ids)
            activity_map = {entry.film_id: FilmAndUserSerializer(entry).data for entry in user_activity}
        else:
            activity_map = {}

        recent_activity = []
        for film in activity_films:
            film_data = MiniFilmSerializer(film, context={"request": request}).data
            film_data["activity"] = activity_map.get(film.pk, {})
            recent_activity.append(film_data)

        watchlist_qs = Watchlist.objects.filter(user=user).select_related("film").order_by("-date_added")[:4]
        watchlist = MiniFilmSerializer(
            [entry.film for entry in watchlist_qs if entry.film],
            many=True,
            context={"request": request}
        ).data

        reviews_qs = Review.objects.filter(log__user=user).select_related("log__film").order_by("-entry_date")[:10]
        reviews_recent = ReviewWithFilmSerializer(reviews_qs[:5], many=True, context={"request": request}).data
        reviews_popular = ReviewWithFilmSerializer(reviews_qs[5:], many=True, context={"request": request}).data

        ratings = reviews_qs.values_list("log__rating__rating_value", flat=True)
        valid_ratings = [r for r in ratings if r is not None]

        count = len(valid_ratings)
        total = sum(valid_ratings, Decimal("0.0")) if count else Decimal("0.0")
        average = total / count if count else 0

        distribution = {}
        for val in valid_ratings:
            val_str = str(val)
            distribution[val_str] = distribution.get(val_str, 0) + 1

        stats = {
            "average": round(average, 2),
            "count": count,
            "distribution": distribution
        }

        return Response({
            "profile": profile_data,
            "favorites": favorites,
            "activity": recent_activity,
            "watchlist": watchlist,
            "reviews": {
                "recent": reviews_recent,
                "popular": reviews_popular
            },
            "stats": stats
        })
