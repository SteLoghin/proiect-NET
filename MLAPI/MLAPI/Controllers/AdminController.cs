using Microsoft.AspNetCore.Mvc;
using MLAPI.Data;
using MLAPI.DataModels;
using System.Collections.Generic;

namespace MLAPI.Controllers
{
    [Route("api/v1/admin")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IRepository<PropertyData> repo;

        public AdminController(IRepository<PropertyData> repo)
        {
            this.repo = repo;
        }

        [HttpGet]
        [Route("properties")]
        public ActionResult<IEnumerable<PropertyData>> Get()
        {
            return null;
        }

        [HttpPost]
        [Route("retrain-model")]
        public ActionResult<string> RetrainModel([FromBody] string identity)
        {
            if (identity != "admin") //WIP
            {
                return BadRequest("an admin should do this");
            }
            //TODO: request for crawler api to get data
            //(as a mechanism that can check if the crawler data has been modified, we can ask for a timestamp and if the timestamp differs, we will proceed with the training)
            //Save data on mongodb
            //train a new model on the newly gained data
            return Ok("succesfully retrained model");
        }

        [HttpPost]
        [Route("set-train-details")]
        public ActionResult<string> ModifyTrainHours([FromBody] string details)
        {
            //train details like how often the model should be retrained
            return null;
        }

        [HttpPut("properties/{id}")]
        public IActionResult Put(int id, PropertyData property)
        {
            //modify only one property
            return null;
        }


    }
}
