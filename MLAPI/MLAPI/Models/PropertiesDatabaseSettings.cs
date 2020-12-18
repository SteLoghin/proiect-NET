namespace MLAPI.Models
{
    public class PropertiesDatabaseSettings : IPropertiesDatabaseSettings
    {
        public string PropertiesCollectionName { get; set; }
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
    }

    
}
