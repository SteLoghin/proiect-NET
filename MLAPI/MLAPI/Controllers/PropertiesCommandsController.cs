using MediatR;
using Microsoft.AspNetCore.Mvc;
using MLAPI.DTOs;
using MLAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MLAPI.Controllers
{
    [Route("api/v1/properties")]
    [ApiController]
    public class PropertiesCommandsController : ControllerBase
    {
        private readonly IMediator mediator;

        public PropertiesCommandsController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpPost]
        public async Task<ActionResult<Property>> Create([FromBody] CreateProperty request)
        {
            //check if valid
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            var property = await mediator.Send(request);
            return CreatedAtAction(nameof(PropertiesController.Get), new { id = property.Id }, property);
        }

        [HttpPut("{id:length(24)}")]
        public async Task<ActionResult<Property>> Put(string id, [FromBody] UpdateProperty request)
        {
            if (id != request.Id)
            {
                return BadRequest("Property Id mismatch");
            }
            var result = await mediator.Send(request);
            if (result == null)
            {
                return NotFound($"Property with id {id} not found");
            }
            return result;
        }

        [HttpDelete("{id:length(24)}")]
        public async Task<ActionResult> Delete(string id)
        {
            var property = await mediator.Send(new GetProperty() { Id = id });
            if (property == null)
            {
                return NotFound($"Property with id {id} not found");
            }
            await mediator.Send(new DeleteProperty() { Id = id });
            return Ok();
        }
    }
}
