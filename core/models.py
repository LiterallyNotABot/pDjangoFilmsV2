from django.db import models

class SoftDeleteModel(models.Model):
    active = models.BooleanField(default=True)
    deleted = models.BooleanField(default=False)

    class Meta:
        abstract = True

class ActiveManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(active=True)

class SoftManagedModel(SoftDeleteModel):
    objects = ActiveManager()
    all_objects = models.Manager()

    class Meta:
        abstract = True

class SoftCreateModel(SoftManagedModel):
    class Meta:
        abstract = True

