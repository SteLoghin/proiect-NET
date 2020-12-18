using MediatR;
using MLAPI.Models;
using MLAPI.DTOs;
using MLAPI.Services;
using System;
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
            Property property = Property.Create(request.Zone, request.Area, request.Rooms, request.Bathrooms, request.ParkingLots, request.Floor, request.Animal, request.Furnished, request.Price);
            propertyService.Create(property);
            return property;
        }
    }
}
