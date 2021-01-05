using Microsoft.AspNetCore.Mvc;
using MLAPI.Models;
using System.Threading.Tasks;
using MLAPI.Services;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace MLAPI.Controllers
{
    [Route("api/v1/admin")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IModelBuilder modelBuilder;
        private readonly ICrawlerComService crawler;
        private readonly IPropertyService propertyService;

        public AdminController(IModelBuilder modelBuilder, ICrawlerComService crawler, IPropertyService propertyService)
        {
            this.modelBuilder = modelBuilder;
            this.crawler = crawler;
            this.propertyService = propertyService;
        }

        [HttpPost]
        [Route("renew-training-data")]
        public async Task<ActionResult> RenewTrainingData()
        {
            var properties = this.crawler.GetCrawlerProperties();
            if(properties == null)
            {
                return Ok("No properties were found in the crawler");
            }
            else
            {
                propertyService.DeleteAll();
                foreach(var p in properties.Result)
                {
                    await propertyService.Create(Property.Create(p));
                }
                return Ok("Succesfully renewed properties");
            }
        }

        [HttpPost]
        [Route("start-crawler")]
        public async Task<ActionResult> RefreshCrawlerData()
        {
            var response = await crawler.StartCrawler();
            if(response == null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
            else
            {
                return Ok(response.Content.ReadAsStringAsync().Result);
            }
        }

        [HttpPost]
        [Route("retrain-model")]
        public async Task<ActionResult<string>> RetrainModel([FromBody] string identity)
        {
            //maybe pass the model type in the request
            if (identity != "admin") //WIP
            {
                return BadRequest("an admin should do this");
            }
            //TODO: request for crawler api to get data
            //(as a mechanism that can check if the crawler data has been modified, we can ask for a timestamp and if the timestamp differs, we will proceed with the training)
            //Save data on mongodb
            //train a new model on the newly gained data
            //get data from database
            string result = await modelBuilder.CreateModel();

            return Ok(result);
        }

        [HttpPost]
        [Route("set-train-details")]
        public ActionResult<string> ModifyTrainHours([FromBody] string details)
        {
            //train details like how often the model should be retrained
            return null;
        }

    }
}
