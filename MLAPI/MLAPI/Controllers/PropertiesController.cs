using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MLAPI.DTOs;
using MLAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MLAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PropertiesController : ControllerBase
    {
        private readonly IMediator mediator;

        public PropertiesController(IMediator mediator)
        {
            this.mediator = mediator;
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Property>> GetById(string id)
        {
            var property = await mediator.Send(new GetProperty { Id = id });
            if (property == null)
            {
                return NotFound();
            }
            return Ok(property);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Property>>> Get([FromQuery] GetProperties request)
        {
            var properties = await mediator.Send(request);
            if (properties == null)
            {
                return NotFound("No properties with the specified criterias found");
            }
            return Ok(properties);
        }
    }
}
