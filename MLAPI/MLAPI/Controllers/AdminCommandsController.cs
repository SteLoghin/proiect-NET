using MediatR;
using Microsoft.AspNetCore.Mvc;
using MLAPI.Data;
using MLAPI.DataModels;
using MLAPI.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MLAPI.Controllers
{
    [Route("api/v1/admin")]
    [ApiController]
    public class AdminCommandsController : ControllerBase
    {
        private readonly IMediator mediator;

        public AdminCommandsController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpGet]
        [Route("properties")]
        public ActionResult<IEnumerable<Property>> Get()
        {
            return null;
        }

        [HttpPost]
        [Route("properties")]
        public async Task<ActionResult<Property>> Create([FromBody] CreateProperty request)
        {
            var property = await mediator.Send(request);
            return property;
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
