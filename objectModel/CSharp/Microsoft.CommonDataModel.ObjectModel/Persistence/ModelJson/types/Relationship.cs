namespace Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson.types
{
    using Newtonsoft.Json;

    /// <summary>
    /// Describes how entities are connected.
    /// If you make changes to this class, please note a custom serializer is used <see cref="CustomSerializer"/>
    /// You can update file "test.extension.cdm.json" so that a test can confirm correct serialization.
    /// </summary>
    public class Relationship : MetadataObject
    {
        [JsonProperty("$type", Order = -2)]
        public string Type { get; set; }
    }
}
