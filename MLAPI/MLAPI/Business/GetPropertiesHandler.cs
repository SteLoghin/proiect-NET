using MediatR;
using MLAPI.Models;
using MLAPI.DTOs;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MLAPI.Services;

namespace MLAPI.Business
{
    public class GetPropertiesHandler : IRequestHandler<GetProperties, List<Property>>
    {
        private readonly IPropertyService propertyService;

        public GetPropertiesHandler(IPropertyService propertyService)
        {
            this.propertyService = propertyService;
        }
        public async Task<List<Property>> Handle(GetProperties request, CancellationToken cancellationToken)
        {
            return await propertyService.Get();
        }
    }
}
