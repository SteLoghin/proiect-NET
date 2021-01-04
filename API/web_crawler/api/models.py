from django.db import models

class Property(models.Model):
    # TODO: add a timestamp for db entries
    rooms = models.IntegerField()
    area = models.FloatField()
    floor = models.IntegerField()
    year = models.IntegerField()
    bathrooms = models.IntegerField()
    kitchens = models.IntegerField()
    link = models.URLField(blank=True)
    zone = models.CharField(max_length=255)
    price = models.FloatField()

    
