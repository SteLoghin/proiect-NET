using MediatR;
using MLAPI.Data;

namespace MLAPI.DTOs
{
    public class CreateProperty : IRequest<Property>
    {
        public float LotArea { get;  set; }
        public string LotConfig { get;  set; }
        public string Zone { get;  set; }
        public string Floors { get;  set; }
        public float OverallCond { get;  set; }
        public float YearBuilt { get;  set; }
        public float Rooms { get;  set; }
        public string SaleCondition { get;  set; }
        public float SalePrice { get;  set; }
    }
}
