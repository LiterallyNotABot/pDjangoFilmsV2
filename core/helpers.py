def reactivate_or_create(model, lookup: dict, defaults: dict = None):
    defaults = defaults or {}
    instance = model.all_objects.filter(**lookup).first()

    if instance:
        if not instance.active:
            for key, value in defaults.items():
                setattr(instance, key, value)
            instance.active = True
            instance.deleted = False
            instance.save()
        return instance, False
    else:
        return model.objects.create(**lookup, **defaults), True
