from rest_framework import viewsets, mixins
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.models import FilmAndUser
from users.serializers.film_and_user_serializer import FilmAndUserSerializer
from core.mixins import SoftCreateMixin, SoftDeleteMixin
from core.helpers import reactivate_or_create


class FilmUserActivityViewSet(
    SoftCreateMixin,
    SoftDeleteMixin,
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
        method = self.request.method.upper()
        auto_create = method in ["PATCH", "PUT"]

        print(f"GET_OBJECT → user: {user.id}, film: {film_id}, method: {method}, auto_create: {auto_create}")

        try:
            instance = self.get_queryset().get(film_id=film_id, user=user)
            print(f"→ instance id: {instance.film_and_user_id}, found existing")
            return instance
        except FilmAndUser.DoesNotExist:
            if auto_create:
                instance, _ = reactivate_or_create(
                    self.get_queryset().model,
                    lookup={"user": user, "film_id": film_id},
                    defaults={}
                )
                print(f"→ instance id: {instance.film_and_user_id}, auto-created")
                return instance
            print("→ no instance found, returning synthetic empty instance")
            return FilmAndUser(
                film_id=film_id,
                user=user,
                watched=False,
                liked=False,
                rating=None
            )

    def raise_does_not_exist(self):
        from rest_framework.exceptions import NotFound
        raise NotFound("No hay relación film-usuario para este film.")

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
        print(f"PATCH — partial_update triggered")
        print(f"Incoming PATCH data: {request.data}")
        return super().partial_update(request, *args, **kwargs)

    def perform_update(self, serializer):
        instance = serializer.save()
        print(
            f"→ UPDATED instance {instance.film_and_user_id}: liked={instance.liked}, watched={instance.watched}, rating={instance.rating}")
        instance.full_clean()  # Esto llama a clean() y valida campos
        instance.save()