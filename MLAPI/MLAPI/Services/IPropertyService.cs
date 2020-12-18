using MLAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MLAPI.Services
{
    public interface IPropertyService
    {
        Task<List<Property>> Get();
        Task<Property> Get(string id);
        Property Create(Property prop);
        void Update(string id, Property newProp);
        void Delete(string id);

    }
}
