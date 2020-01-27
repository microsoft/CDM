// --------------------------------------------------------------------------------------------------------------------
// <copyright file="ManifestContent.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
// <summary>
//   The folder declaration for CDM folders format.
// </summary>
// --------------------------------------------------------------------------------------------------------------------
namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types
{
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using System;
    using System.Collections.Generic;

    /// <summary>
    /// The folder declaration for CDM folders format.
    /// </summary>
    public class ManifestContent : DocumentContent, FileStatus
    {

        [JsonProperty("manifestName")]
        public string ManifestName { get; set; }

        [JsonProperty("folioName")]
        public string FolioName { get; set; }

        [JsonProperty("explanation", NullValueHandling = NullValueHandling.Ignore)]
        public string Explanation { get; set; }

        /// <summary>
        /// Gets or sets the object exhibits traits.
        /// </summary>
        [JsonProperty("exhibitsTraits", NullValueHandling = NullValueHandling.Ignore)]
        public List<JToken> ExhibitsTraits { get; set; }

        /// <summary>
        /// List of entities
        /// </summary>
        [JsonProperty("entities")]
        public List<JToken> Entities { get; set; }

        /// <summary>
        /// List of subManifests within this manifest
        /// </summary>
        [JsonProperty("subManifests", NullValueHandling = NullValueHandling.Ignore)]
        public List<ManifestDeclaration> SubManifests { get; set; }

        /// <summary>
        /// List of subManifests within this manifest
        /// </summary>
        [JsonProperty("subFolios", NullValueHandling = NullValueHandling.Ignore)]
        public List<ManifestDeclaration> SubFolios { get; set; }

        /// <inheritdoc />
        [JsonProperty("lastFileStatusCheckTime", NullValueHandling = NullValueHandling.Ignore)]
        public string LastFileStatusCheckTime { get; set; }

        /// <inheritdoc />
        [JsonProperty("lastFileModifiedTime", NullValueHandling = NullValueHandling.Ignore)]
        public string LastFileModifiedTime { get; set; }

        /// <inheritdoc />
        [JsonProperty("lastChildFileModifiedTime", NullValueHandling = NullValueHandling.Ignore)]
        public string LastChildFileModifiedTime { get; set; }

        /// <summary>
        /// List of relationships in which the entities in the current manifest are involved in.
        /// </summary>
        [JsonProperty("relationships", NullValueHandling = NullValueHandling.Ignore)]
        public List<E2ERelationship> Relationships { get; set; }
    }
}
