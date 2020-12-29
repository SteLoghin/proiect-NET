using MediatR;
using MLAPI.Models;
using MLAPI.DTOs;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MLAPI.Services;
using System.Reflection;
using MongoDB.Driver;

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
            FilterDefinition<Property> combinedFilter = Builders<Property>.Filter.Where(prop => true);

            if (request.Id != null)
            {
                combinedFilter = Builders<Property>.Filter.And(combinedFilter,
                    Builders<Property>.Filter.Eq(prop => prop.Id, request.Id));
            }
            if (request.Rooms != null)
            {
                combinedFilter = Builders<Property>.Filter.And(combinedFilter,
                    Builders<Property>.Filter.Eq(prop => prop.Rooms, request.Rooms));
            }
            if (request.Area != null)
            {
                combinedFilter = Builders<Property>.Filter.And(combinedFilter,
                    Builders<Property>.Filter.Eq(prop => prop.Area, request.Area));
            }
            if (request.Floor != null)
            {
                combinedFilter = Builders<Property>.Filter.And(combinedFilter,
                    Builders<Property>.Filter.Eq(prop => prop.Floor, request.Floor));
            }
            if (request.Year != null)
            {
                combinedFilter = Builders<Property>.Filter.And(combinedFilter,
                    Builders<Property>.Filter.Eq(prop => prop.Year, request.Year));
            }
            if (request.Bathrooms != null)
            {
                combinedFilter = Builders<Property>.Filter.And(combinedFilter,
                    Builders<Property>.Filter.Eq(prop => prop.Bathrooms, request.Bathrooms));
            }
            if (request.Kitchens != null)
            {
                combinedFilter = Builders<Property>.Filter.And(combinedFilter,
                    Builders<Property>.Filter.Eq(prop => prop.Kitchens, request.Kitchens));
            }
            if (request.Zone != null)
            {
                combinedFilter = Builders<Property>.Filter.And(combinedFilter,
                    Builders<Property>.Filter.Eq(prop => prop.Zone, request.Zone));
            }
            if (request.Price != null)
            {
                combinedFilter = Builders<Property>.Filter.And(combinedFilter,
                    Builders<Property>.Filter.Eq(prop => prop.Price, request.Price));
            }

            var properties = await propertyService.Get(combinedFilter);

            if (properties.Count == 0)
            {
                return null;
            }
            return properties;
        }
    }
}
