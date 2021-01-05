using MLAPI.DataModels;
using MLAPI.DTOs;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MLAPI.Models
{
    public class Property
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; private set; }

        public float Rooms { get; private set; }

        public float Area { get; private set; }

        public float Floor { get; private set; }

        public float Year { get; private set; }

        public float Bathrooms { get; private set; }

        public string Kitchens { get; private set; }

        public string Link { get; private set; }

        public string Zone { get; private set; }

        public float Price { get; private set; }

        public static Property Create(CreateProperty property)
        {
            return new Property
            {
                Zone = property.Zone,
                Area = property.Area,
                Rooms = property.Rooms,
                Bathrooms = property.Bathrooms,
                Kitchens = property.Kitchens,
                Floor = property.Floor,
                Link = property.Link,
                Year = property.Year,
                Price = property.Price
            };
        }

        public void Update(UpdateProperty property)
        {
            Zone = property.Zone;
            Area = property.Area;
            Rooms = property.Rooms;
            Bathrooms = property.Bathrooms;
            Kitchens = property.Kitchens;
            Floor = property.Floor;
            Link = property.Link;
            Year = property.Year;
            Price = property.Price;
        }
        
        public static PropertyData Cast(Property property)
        {
            return new PropertyData
            {
                Zone = property.Zone,
                Area = property.Area,
                Rooms = property.Rooms,
                Bathrooms = property.Bathrooms,
                Kitchens = property.Kitchens,
                Floor = property.Floor,
                Link = property.Link,
                Year = property.Year,
                Price = property.Price
            };
        }
    }
}
