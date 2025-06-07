from rest_framework import viewsets, mixins
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.models import FilmAndUser, Watchlist
from users.serializers.film_and_user_serializer import FilmAndUserSerializer
import logging

logger = logging.getLogger(__name__)
from core.mixins import SoftCreateMixin, SoftDeleteMixin, SoftObjectRetrievalMixin


class FilmUserActivityViewSet(
    SoftCreateMixin,
    SoftDeleteMixin,
    SoftObjectRetrievalMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet
):
    serializer_class = FilmAndUserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return FilmAndUser.all_objects.filter(user=self.request.user)

    def get_object(self):
        film_id = self.kwargs["film_id"]
        user = self.request.user
        auto_create = self.request.method.upper() in ["PATCH", "PUT"]

        logger.debug(
            "GET_OBJECT → user: %s, film: %s, auto_create: %s",
            user.id,
            film_id,
            auto_create,
        )

        instance = self.get_or_soft_create_object(
            model=FilmAndUser,
            lookup={"user": user, "film_id": film_id},
            defaults={},
            auto_create=auto_create
        )

        if instance:
            return instance

        logger.debug("\u2192 no instance found, returning synthetic empty instance")
        return FilmAndUser(
            film_id=film_id,
            user=user,
            watched=False,
            liked=False,
            rating=None
        )

    def get_lookup_from_validated_data(self, data):
        return {
            "user": self.request.user,
            "film": data["film"],
        }

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        logger.debug("PATCH — partial_update triggered")
        logger.debug("Incoming PATCH data: %s", request.data)
        return super().partial_update(request, *args, **kwargs)

    def perform_update(self, serializer):
        instance = serializer.save()
        instance.full_clean()
        instance.save()

        if instance.should_soft_delete():
            logger.info(
                "\u2192 instance %s now empty, performing soft delete",
                instance.film_and_user_id,
            )
            instance.active = False
            instance.deleted = True
            instance.save()

class FilmActivitiesView(mixins.ListModelMixin, viewsets.GenericViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        film_ids = request.data.get("film_ids", [])
        if not isinstance(film_ids, list):
            return Response({"detail": "film_ids must be a list"}, status=400)

        user = request.user
        activities = FilmAndUser.all_objects.filter(user=user, film_id__in=film_ids)
        watchlisted_ids = set(
            Watchlist.objects.filter(user=user, film_id__in=film_ids).values_list("film_id", flat=True)
        )

        result = {int(fid): {"liked": False, "watched": False, "rating": None, "watchlisted": False} for fid in film_ids}
        for act in activities:
            result[act.film_id].update({
                "liked": act.liked,
                "watched": act.watched,
                "rating": float(act.rating.rating_value) if act.rating else None,
            })
        for fid in watchlisted_ids:
            if int(fid) in result:
                result[int(fid)]["watchlisted"] = True

        return Response(result)
