﻿

namespace MLAPI.DTOs
{
    public class GetPropertyRequest
    {
        public string Id { get; set; }
        public float Rooms { get; set; }
        public float Area { get; set; }
        public float Floor { get; set; }
        public float Year { get; set; }
        public float Bathrooms { get; set; }
        public string Kitchens { get; set; }
        public string Link { get; set; }
        public string Zone { get; set; }
        public float Price { get; set; }
    }
}
