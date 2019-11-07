namespace Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson.types
{
    using Newtonsoft.Json;

    /// <summary>
    /// Entity information stored in a schema.
    /// </summary>
    public class SchemaEntityInfo
    {
        [JsonProperty("entityName")]
        public string EntityName { get; set; }

        [JsonProperty("entityVersion")]
        public string EntityVersion { get; set; }

        [JsonProperty("entityNamespace")]
        public string EntityNamespace { get; set; }
    }
}
