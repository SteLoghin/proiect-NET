using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.ML;
using MLAPI.DataModels;
using MLAPI.DTOs;
using System;
using System.Collections.Generic;

namespace MLAPI.Controllers
{
    [Route("api/v1/predictions")]
    [ApiController]
    public class PricePredictionsController : ControllerBase
    {
        private readonly PredictionEnginePool<PropertyData, PropertyPrediction> predictionEnginePool;
        public PricePredictionsController(PredictionEnginePool<PropertyData, PropertyPrediction> predictionEnginePool)
        {
            this.predictionEnginePool = predictionEnginePool;
        }

        [HttpGet]
        public ActionResult<double> Get([FromQuery] PropertyData data)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid property data");
            }

            PropertyPrediction predictedValue = this.predictionEnginePool.Predict(modelName: "PropertyPriceModel", example: data);
            double price = Convert.ToDouble(predictedValue.Price);

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
