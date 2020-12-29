using MediatR;
using MLAPI.DTOs;
using MLAPI.Models;
using MLAPI.Services;
using System.Threading;
using System.Threading.Tasks;

namespace MLAPI.Business
{
    public class GetPropertyHandler : IRequestHandler<GetProperty, Property>
    {
        private readonly IPropertyService propertyService;

        public GetPropertyHandler(IPropertyService propertyService)
        {
            this.propertyService = propertyService;
        }
        public async Task<Property> Handle(GetProperty request, CancellationToken cancellationToken)
        {
            if(request.Id.Length == 24)
            {
                return await propertyService.GetById(request.Id);
            }
            return null;
        }

    }
}
