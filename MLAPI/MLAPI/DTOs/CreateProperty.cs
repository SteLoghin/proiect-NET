using MediatR;
using MLAPI.Models;

namespace MLAPI.DTOs
{
    public class CreateProperty : IRequest<Property>
    {
        public string Zone { get; set; }

        public float Area { get; set; }

        public float Rooms { get; set; }

        public float Bathrooms { get; set; }

        public float ParkingLots { get; set; }

        public float Floor { get; set; }

        public string Animal { get; set; }

        public string Furnished { get; set; }

        public float Price { get; set; }
    }
}
