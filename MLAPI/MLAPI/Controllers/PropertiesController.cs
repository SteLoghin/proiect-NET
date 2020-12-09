using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.ML;
using MLAPI.DataModels;
using System;
using System.Collections.Generic;

namespace MLAPI.Controllers
{
    [Route("api/v1/predictions")]
    [ApiController]
    public class PropertiesController : ControllerBase
    {
        private readonly PredictionEnginePool<PropertyData, PropertyPrediction> _predictionEnginePool;
        public PropertiesController(PredictionEnginePool<PropertyData, PropertyPrediction> predictionEnginePool)
        {
            _predictionEnginePool = predictionEnginePool;
        }

        [HttpPost]
        public ActionResult<double> Post([FromBody] PropertyData data)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            PropertyPrediction predictedValue = _predictionEnginePool.Predict(modelName: "PropertyPriceModel", example: data);
            double price = Convert.ToDouble(predictedValue.SalePrice);

            return Ok(price);
        }

        //map data will be represented by the name(which is a key in the dictonary) and a pair of double(predicted price) and list of coordinates
        [HttpGet]
        [Route("map")]
        public ActionResult<IEnumerable<Dictionary<string, (double, List<(double, double)>)>>> GetMapData()
        {
            return null;
        }

    }
}
