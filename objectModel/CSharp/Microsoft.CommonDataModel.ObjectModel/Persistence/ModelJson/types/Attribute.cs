namespace Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson.types
{
    using Newtonsoft.Json;

    /// <summary>
    /// Represents a field within an entity.
    /// If you make changes to this class, please note a custom serializer is used <see cref="CustomSerializer"/>
    /// </summary>
    public class Attribute : DataObject
    {
        [JsonProperty("dataType")]
        public string DataType { get; set; }
    }
}
