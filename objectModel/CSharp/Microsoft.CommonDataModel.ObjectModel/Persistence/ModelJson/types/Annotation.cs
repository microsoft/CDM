namespace Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson.types
{
    using Newtonsoft.Json;

    /// <summary>
    /// Non essential contextual information (key/value pairs) that can be used to store additional
    /// context about a properties in the model file. Annotations can be applied at multiple levels 
    /// including to entities and attributes. Producers can add a prefix, such as “contonso.com:MappingDisplayHint” 
    /// where “contonso.com:” is the prefix, when annotations are not necessarily relevant to other consumers. 
    /// </summary>
    public class Annotation
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("value")]
        public string Value { get; set; }
    }
}
