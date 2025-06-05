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

    overlapping_keys = set(lookup.keys()) & set(defaults.keys())
    if overlapping_keys:
        raise ValueError(f"Overlapping keys in lookup/defaults: {overlapping_keys}")

    return model.objects.create(**{**lookup, **defaults}), True
