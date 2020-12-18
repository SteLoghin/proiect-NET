namespace MLAPI.Models
{
    public interface IPropertiesDatabaseSettings
    {
        string PropertiesCollectionName { get; set; }
        string ConnectionString { get; set; }
        string DatabaseName { get; set; }
    }
}
