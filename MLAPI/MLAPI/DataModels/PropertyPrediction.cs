using Microsoft.ML.Data;

namespace MLAPI.DataModels
{
    public class PropertyPrediction
    {
        [ColumnName("Score")]
        public float Price { get; set; }

    }
}
