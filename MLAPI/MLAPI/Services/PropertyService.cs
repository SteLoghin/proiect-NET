
using MLAPI.Models;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MLAPI.Services
{
    public class PropertyService : IPropertyService
    {
        private readonly IMongoCollection<Property> _properties;
        public PropertyService(IPropertiesDatabaseSettings settings)
        { 
            var dbClient = new MongoClient(settings.ConnectionString);
            var database = dbClient.GetDatabase(settings.DatabaseName);

            _properties = database.GetCollection<Property>(settings.PropertiesCollectionName);
        }

        public Task<List<Property>> Get() => _properties.Find(property => true).ToListAsync();

        public Task<Property> Get(string id) => _properties.Find(p => p.Id == id).FirstOrDefaultAsync();

        public Property Create(Property prop)
        {
            _properties.InsertOne(prop);
            return prop;
        }

        public void Update(string id, Property newProp)
        {
            _properties.ReplaceOne(p => p.Id == id, newProp);
        }

        public void Delete(string id) => _properties.DeleteOne(p => p.Id == id);
    }
}
