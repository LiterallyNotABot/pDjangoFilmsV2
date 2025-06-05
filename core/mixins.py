from rest_framework import status
from rest_framework.response import Response
from core.helpers import reactivate_or_create


class SoftDeleteMixin:
    def perform_destroy(self, instance):
        instance.active = False
        instance.deleted = True
        instance.save()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)



class SoftCreateMixin:
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        lookup = self.get_lookup_from_validated_data(serializer.validated_data)

        instance, created = reactivate_or_create(
            self.get_queryset().model,
            lookup=lookup,
            defaults=serializer.validated_data
        )

        output_serializer = self.get_serializer(instance)
        status_code = status.HTTP_200_OK if not created else status.HTTP_201_CREATED
        return Response(output_serializer.data, status=status_code)

    def get_lookup_from_validated_data(self, data):
        raise NotImplementedError("Must define get_lookup_from_validated_data() in your ViewSet.")

class SoftObjectRetrievalMixin:
    def get_or_soft_create_object(self, model, lookup: dict, defaults: dict = None, auto_create=False):
        instance = model.all_objects.filter(**lookup).first()
        if instance:
            if not instance.active and auto_create:
                instance.active = True
                instance.deleted = False
                instance.save()
            return instance

        if auto_create:
            instance, _ = reactivate_or_create(model, lookup=lookup, defaults=defaults or {})
            return instance

        return None  # Caller decides what to do with None
