using System;

namespace MLAPI.Data
{
    public class Property
    {
        public Guid Id { get; private set; }

        public float LotArea { get; private set; }

        public string LotConfig { get; private set; }

        public string Zone { get; private set; }

        public string Floors { get; private set; }

        public float OverallCond { get; private set; }

        public float YearBuilt { get; private set; }

        public float Rooms { get; private set; }

        public string SaleCondition { get; private set; }

        public float SalePrice { get; private set; }

        public static Property Create(float lotArea, string lotConfig, string zone, string floors, float overallCondition, float year, float rooms, string saleCondition, float price)
        {
            return new Property
            {
                Id = Guid.NewGuid(),
                LotArea = lotArea,
                LotConfig = lotConfig,
                Zone = zone,
                Floors = floors,
                OverallCond = overallCondition,
                YearBuilt = year,
                Rooms = rooms,
                SaleCondition = saleCondition,
                SalePrice = price
            };
        }

        public void Update(float lotArea, string lotConfig, string zone, string floors, float overallCondition, float year, float rooms, string saleCondition, float price)
        {
            LotArea = lotArea;
            LotConfig = lotConfig;
            Zone = zone;
            Floors = floors;
            OverallCond = overallCondition;
            YearBuilt = year;
            Rooms = rooms;
            SaleCondition = saleCondition;
            SalePrice = price;
        }

    }
}
