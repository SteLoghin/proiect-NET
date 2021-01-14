using MediatR;
using MLAPI.Models;

namespace MLAPI.DTOs
{
    public class CreateProperty : IRequest<Property>
    {
        public float Rooms { get; set; }

        public float Area { get; set; }

        public float Floor { get; set; }

        public float Year { get; set; }

        public float Bathrooms { get; set; }

        public float Kitchens { get; set; }

        public string Link { get; set; }

        public string Zone { get; set; }

        public float Price { get; set; }
    }
}
