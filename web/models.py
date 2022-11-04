from django.db import models
from django.urls import reverse

class Task(models.Model):
    country = models.CharField(max_length=200, verbose_name='country')
    regions_city = models.TextField(verbose_name='regions_city')

    def delete_url(self):
        return reverse('delete-model', kwargs={'pk': self.id})
