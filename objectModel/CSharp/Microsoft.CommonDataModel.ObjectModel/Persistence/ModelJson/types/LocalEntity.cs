namespace Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson.types
{
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Newtonsoft.Json;
    using System.Collections.Generic;

    /// <summary>
    /// Represents an entity that belongs to the current model.
    /// If you make changes to this class, please note a custom serializer is used <see cref="CustomSerializer"/>
    /// </summary>
    public class LocalEntity : Entity
    {
        [JsonProperty("attributes")]
        public List<Attribute> Attributes { get; set; }

        [JsonProperty("partitions", NullValueHandling = NullValueHandling.Ignore)]
        public List<Partition> Partitions { get; set; }

        [JsonProperty("schemas", NullValueHandling = NullValueHandling.Ignore)]
        public List<string> Schemas { get; set; }

        [JsonProperty("cdm:imports", NullValueHandling = NullValueHandling.Ignore)]
        public List<Import> Imports { get; set; }
    }
}
