from django.db import models

class PropertyManager(models.Manager):
    def create_property(self, dict):
        new_property = self.create(rooms=dict["rooms"], 
                                area=dict["area"], 
                                floor=dict["floor"], 
                                year=dict["year"], 
                                bathrooms=dict["bathrooms"], 
                                kitchens=dict["kitchens"], 
                                link=dict["link"], 
                                zone=dict["zone"], 
                                price=dict["price"])
        return new_property

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
    objects = PropertyManager()

    
