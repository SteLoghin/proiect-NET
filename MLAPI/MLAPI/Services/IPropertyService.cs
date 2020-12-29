using MLAPI.Models;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace MLAPI.Services
{
    public interface IPropertyService
    {
        Task<List<Property>> Get(FilterDefinition<Property> filter);
        Task<Property> GetById(string id);
        Task<Property> Create(Property prop);
        void Update(string id, Property newProp);
        void Delete(string id);

    }
}
