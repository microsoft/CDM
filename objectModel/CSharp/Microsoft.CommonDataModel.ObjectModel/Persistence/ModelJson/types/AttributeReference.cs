namespace Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson.types
{
    using Newtonsoft.Json;

    public class AttributeReference
    {
        [JsonProperty("entityName")]
        public string EntityName { get; set; }

        [JsonProperty("attributeName")]
        public string AttributeName { get; set; }
    }
}
