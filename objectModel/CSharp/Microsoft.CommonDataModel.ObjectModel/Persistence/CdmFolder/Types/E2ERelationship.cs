// --------------------------------------------------------------------------------------------------------------------
// <copyright file="E2ERelationship.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
// <summary>
//   The entity to entity relationships that will be populated in a manifest.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

using Newtonsoft.Json;

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types
{
    using Newtonsoft.Json;

    /// <summary>
    /// The entity to entity relationship object that will be populated in a manifest.
    /// </summary>
    public class E2ERelationship
    {
        /// <summary>
        /// Gets or sets the absolute corpus path of the referencing entity.
        /// </summary>
        [JsonProperty("fromEntity", NullValueHandling = NullValueHandling.Ignore)]
        public string FromEntity { get; set; }

        /// <summary>
        /// Gets or sets the name of the attribute that is referencing the other entity.
        /// </summary>
        [JsonProperty("fromEntityAttribute", NullValueHandling = NullValueHandling.Ignore)]
        public string FromEntityAttribute { get; set; }

        /// <summary>
        /// Gets or sets the absolute corpus path of the referenced entity.
        /// </summary>
        [JsonProperty("toEntity", NullValueHandling = NullValueHandling.Ignore)]
        public string ToEntity { get; set; }

        /// <summary>
        /// Gets or sets the name of the attribute that is being referenced.
        /// </summary>
        [JsonProperty("toEntityAttribute", NullValueHandling = NullValueHandling.Ignore)]
        public string ToEntityAttribute { get; set; }
    }
}
