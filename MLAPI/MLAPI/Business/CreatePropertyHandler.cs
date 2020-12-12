using MediatR;
using MLAPI.Data;
using MLAPI.DTOs;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace MLAPI.Business
{
    public class CreatePropertyHandler : IRequestHandler<CreateProperty, Property>
    {
        //private readonly DataContext context;

        public CreatePropertyHandler()//DataContext context)
        {
            //this.context = context;
        }
        public async Task<Property> Handle(CreateProperty request, CancellationToken cancellationToken)
        {
            Property property = Property.Create(request.Zone, request.Area, request.Rooms, request.Bathrooms, request.ParkingLots, request.Floor, request.Animal, request.Furnished, request.Price);
            //add property to db
            //save changes by id
            return property;  //use the get by id method
        }
    }
}
