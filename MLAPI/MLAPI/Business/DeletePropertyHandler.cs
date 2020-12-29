using MediatR;
using MLAPI.DTOs;
using MLAPI.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace MLAPI.Business
{
    public class DeletePropertyHandler : IRequestHandler<DeleteProperty>
    {
        private readonly IPropertyService propertyService;

        public DeletePropertyHandler(IPropertyService propertyService)
        {
            this.propertyService = propertyService;
        }
        public async Task<Unit> Handle(DeleteProperty request, CancellationToken cancellationToken)
        {
            var propertyToDelete = await propertyService.GetById(request.Id);
            if(propertyToDelete == null)
            {
                throw new Exception("Record does not exist");
            }
            propertyService.Delete(request.Id);
            return Unit.Value;
        }
    }
}
