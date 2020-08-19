from django.db import models
from django.utils.timezone import now
import random
import string

def generate_random_hash(length: int = 8) -> str:
    options = string.ascii_letters + string.digits
    result = ''.join((random.choice(options) for i in range(length)))
    return result

class Timestamps(models.Model):
    created_at = models.DateTimeField(default=now, editable=False)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        abstract = True