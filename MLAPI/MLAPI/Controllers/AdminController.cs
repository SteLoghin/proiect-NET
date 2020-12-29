using MediatR;
using Microsoft.AspNetCore.Mvc;
using MLAPI.Models;
using MLAPI.DataModels;
using MLAPI.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using MLAPI.Services;

namespace MLAPI.Controllers
{
    [Route("api/v1/admin")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IModelBuilder modelBuilder;

        public AdminController(IModelBuilder modelBuilder)
        {
            this.modelBuilder = modelBuilder;
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
