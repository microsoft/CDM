namespace Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson.types
{
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using System;
    using System.Collections.Generic;

    /// <summary>
    /// Represents the data in the CDM folder, metadata and location, 
    /// as well as how it was generated and by which data producer.
    /// If you make changes to this class, please note a custom serializer is used <see cref="CustomSerializer"/>
    /// You can update file "test.extension.cdm.json" so that a test can confirm correct serialization.
    /// </summary>
    public class Model : DataObject
    {
        [JsonProperty("application", NullValueHandling = NullValueHandling.Ignore)]
        public string Application { get; set; }

        [JsonProperty("version", Order = 1)]
        public string Version { get; set; }

        [JsonProperty("entities")]
        public List<JToken> Entities { get; set; }

        [JsonProperty("relationships", NullValueHandling = NullValueHandling.Ignore)]
        public List<SingleKeyRelationship> Relationships { get; set; }

        [JsonProperty("referenceModels")]
        public List<ReferenceModel> ReferenceModels { get; set; }

        [JsonProperty("culture", NullValueHandling = NullValueHandling.Ignore)]
        public string Culture { get; set; }

        [JsonProperty("modifiedTime", NullValueHandling = NullValueHandling.Ignore)]
        public DateTimeOffset? ModifiedTime { get; set; }

        [JsonProperty("cdm:imports", NullValueHandling = NullValueHandling.Ignore)]
        public List<Import> Imports { get; set; }

        [JsonProperty("cdm:lastFileStatusCheckTime", NullValueHandling = NullValueHandling.Ignore)]
        public DateTimeOffset? LastFileStatusCheckTime { get; set; }

        [JsonProperty("cdm:lastChildFileModifiedTime", NullValueHandling = NullValueHandling.Ignore)]
        public DateTimeOffset? LastChildFileModifiedTime { get; set; }
    }
}
