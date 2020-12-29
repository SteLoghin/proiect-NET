using MediatR;
using MLAPI.Models;
using MLAPI.DTOs;
using MLAPI.Services;
using System.Threading;
using System.Threading.Tasks;

namespace MLAPI.Business
{
    public class CreatePropertyHandler : IRequestHandler<CreateProperty, Property>
    {
        private readonly IPropertyService propertyService;

        public CreatePropertyHandler(IPropertyService propertyService)
        {
            this.propertyService = propertyService;
        }
        public async Task<Property> Handle(CreateProperty request, CancellationToken cancellationToken)
        {
            Property property = Property.Create(request);
            await propertyService.Create(property);
            return property;
        }
    }
}
