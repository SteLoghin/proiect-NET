using System;

namespace MLAPI.Data
{
    public class Property
    {
        public Guid Id { get; private set; }

        public string Zone { get; private set; }

        public float Area { get; private set; }

        public float Rooms { get; private set; }

        public float Bathrooms { get; private set; }

        public float ParkingLots { get; private set; }

        public float Floor { get; private set; }

        public string Animal { get; private set; }

        public string Furnished { get; private set; }

        public float Price { get; private set; }

        public static Property Create(string zone, float area, float rooms, float bathrooms, float parkingLots, float floor, string animal, string furnished, float price)
        {
            return new Property
            {
                Id = Guid.NewGuid(),
                Zone = zone,
                Area = area,
                Rooms = rooms,
                Bathrooms = bathrooms,
                ParkingLots = parkingLots,
                Floor = floor,
                Animal = animal,
                Furnished = furnished,
                Price = price
            };
        }

        public void Update(string zone, float area, float rooms, float bathrooms, float parkingLots, float floor, string animal, string furnished, float price)
        {
            Zone = zone;
            Area = area;
            Rooms = rooms;
            Bathrooms = bathrooms;
            ParkingLots = parkingLots;
            Floor = floor;
            Animal = animal;
            Furnished = furnished;
            Price = price;
        }

    }
}
