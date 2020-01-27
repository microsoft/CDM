namespace Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson.types
{
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using System.Collections.Generic;

    /// <summary>
    /// Represents a base class for a metadata object.
    /// If you make changes to this class, please note a custom serializer is used <see cref="CustomSerializer"/>
    /// You can update file "test.extension.cdm.json" so that a test can confirm correct serialization.
    /// </summary>
    [JsonConverter(typeof (CustomSerializer))]
    public class MetadataObject
    {
        [JsonIgnore]
        public JObject ExtensionFields { get; set; } = new JObject();

        [JsonProperty("name", NullValueHandling = NullValueHandling.Ignore)]
        public string Name { get; set; }

        [JsonProperty("description", NullValueHandling = NullValueHandling.Ignore)]
        public string Description { get; set; }

        [JsonProperty("annotations", NullValueHandling = NullValueHandling.Ignore)]
        public List<Annotation> Annotations { get; set; }

        [JsonProperty("cdm:traits", NullValueHandling = NullValueHandling.Ignore)]
        public List<JToken> Traits { get; set; }
    }
}
