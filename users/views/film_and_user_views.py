from rest_framework import viewsets, mixins
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.models import FilmAndUser
from users.serializers.film_and_user_serializer import FilmAndUserSerializer
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

        print(f"GET_OBJECT → user: {user.id}, film: {film_id}, auto_create: {auto_create}")

        instance = self.get_or_soft_create_object(
            model=FilmAndUser,
            lookup={"user": user, "film_id": film_id},
            defaults={},
            auto_create=auto_create
        )

        if instance:
            return instance

        print("→ no instance found, returning synthetic empty instance")
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
        print("PATCH — partial_update triggered")
        print(f"Incoming PATCH data: {request.data}")
        return super().partial_update(request, *args, **kwargs)

    def perform_update(self, serializer):
        instance = serializer.save()
        instance.full_clean()
        instance.save()

        if instance.should_soft_delete():
            print(f"→ instance {instance.film_and_user_id} now empty, performing soft delete")
            instance.active = False
            instance.deleted = True
            instance.save()
