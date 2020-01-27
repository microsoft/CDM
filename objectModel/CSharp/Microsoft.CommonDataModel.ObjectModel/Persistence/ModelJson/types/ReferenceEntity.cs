using Newtonsoft.Json;

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson.types
{
    /// <summary>
    ///  Represents a model that contains source to an external model.
    /// If you make changes to this class, please note a custom serializer is used <see cref="CustomSerializer"/>
    /// </summary>
    public class ReferenceEntity : Entity
    {
        [JsonProperty("source")]
        public string Source { get; set; }

        [JsonProperty("modelId")]
        public string ModelId { get; set; }
    }
}
