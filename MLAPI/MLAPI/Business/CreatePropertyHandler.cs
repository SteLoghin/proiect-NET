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
            Property property = Property.Create(request.LotArea, request.LotConfig, request.Zone, request.Floors, request.OverallCond, request.YearBuilt, request.Rooms, request.SaleCondition, request.SalePrice);
            //add property to db
            //save changes by id
            return property;  //use the get by id method
        }
    }
}
