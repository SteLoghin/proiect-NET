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

        public async Task<List<Property>> Get(FilterDefinition<Property> filter)
        {
            return await _properties.Find(filter).ToListAsync();
        }

        public async Task<Property> GetById(string id) => await _properties.FindAsync(p => p.Id == id).Result.FirstOrDefaultAsync();

        public async Task<Property> Create(Property prop)
        {
            await _properties.InsertOneAsync(prop);
            return prop;
        }

        public async void Update(string id, Property newProp)
        {
            await _properties.ReplaceOneAsync(p => p.Id == id, newProp);
        }

        public async void Delete(string id) => await _properties.DeleteOneAsync(p => p.Id == id);

        public async void DeleteAll() => await _properties.DeleteManyAsync(Builders<Property>.Filter.Where(prop => true));
    }
}
