using Microsoft.ML.Data;

namespace MLAPI.DataModels
{
    public class PropertyData
    {
        [ColumnName("Zone"), LoadColumn(0)]
        public string Zone { get; set; }


        [ColumnName("Area"), LoadColumn(1)]
        public float Area { get; set; }


        [ColumnName("Rooms"), LoadColumn(2)]
        public float Rooms { get; set; }


        [ColumnName("Bathrooms"), LoadColumn(3)]
        public float Bathrooms { get; set; }


        [ColumnName("ParkingLots"), LoadColumn(4)]
        public float ParkingLots { get; set; }


        [ColumnName("Floor"), LoadColumn(5)]
        public float Floor { get; set; }


        [ColumnName("Animal"), LoadColumn(6)]
        public string Animal { get; set; }


        [ColumnName("Furnished"), LoadColumn(7)]
        public string Furnished { get; set; }


        [ColumnName("Price"), LoadColumn(8)]
        public float Price { get; set; }



    }
}
