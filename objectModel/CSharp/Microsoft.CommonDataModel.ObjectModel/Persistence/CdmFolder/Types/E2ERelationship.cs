// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Newtonsoft.Json;

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types
{
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using System.Collections.Generic;

    /// <summary>
    /// The entity to entity relationship object that will be populated in a manifest.
    /// </summary>
    public class E2ERelationship
    {
        /// <summary>
        /// Gets or sets name of the relationship.
        /// </summary>
        [JsonProperty("name", NullValueHandling = NullValueHandling.Ignore)]
        public string Name { get; set; }

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

        /// <summary>
        /// Gets or sets the purpose resolved traits that represent relationship meanings.
        /// </summary>
        [JsonProperty("exhibitsTraits", NullValueHandling = NullValueHandling.Ignore)]
        public List<JToken> ExhibitsTraits { get; set; }
    }
}
