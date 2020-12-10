using Microsoft.ML.Data;
using MLAPI.Data;

namespace MLAPI.DataModels
{
    public class PropertyData
    {
        [ColumnName("LotArea"), LoadColumn(0)]
        public float LotArea { get; set; }


        [ColumnName("LotConfig"), LoadColumn(1)]
        public string LotConfig { get; set; }


        [ColumnName("Zone"), LoadColumn(2)]
        public string Zone { get; set; }


        [ColumnName("Floors"), LoadColumn(3)]
        public string Floors { get; set; }


        [ColumnName("OverallCond"), LoadColumn(4)]
        public float OverallCond { get; set; }


        [ColumnName("YearBuilt"), LoadColumn(5)]
        public float YearBuilt { get; set; }


        [ColumnName("Rooms"), LoadColumn(6)]
        public float Rooms { get; set; }


        [ColumnName("SaleCondition"), LoadColumn(7)]
        public string SaleCondition { get; set; }


        [ColumnName("SalePrice"), LoadColumn(8)]
        public float SalePrice { get; set; }


    }
}
