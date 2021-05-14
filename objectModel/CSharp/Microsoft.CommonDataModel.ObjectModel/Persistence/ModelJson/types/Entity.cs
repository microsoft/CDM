// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson.types
{
    using Newtonsoft.Json;
    using System;

    /// <summary>
    /// Defines a base class for an entity. 
    /// An entity is a set of attributes and metadata that defines a concept 
    /// like Account or Contact and can be defined by any data producer.
    /// If you make changes to this class, please note a custom serializer is used <see cref="CustomSerializer"/>
    /// </summary>
    public class Entity : DataObject
    {
        [JsonProperty("$type", Order = -2)]
        public string Type { get; set; }

        [JsonProperty("cdm:lastChildFileModifiedTime", NullValueHandling = NullValueHandling.Ignore)]
        public DateTimeOffset? LastChildFileModifiedTime { get; set; }

        [JsonProperty("cdm:lastFileModifiedTime", NullValueHandling = NullValueHandling.Ignore)]
        public DateTimeOffset? LastFileModifiedTime { get; set; }

        [JsonProperty("cdm:lastFileStatusCheckTime", NullValueHandling = NullValueHandling.Ignore)]
        public DateTimeOffset? LastFileStatusCheckTime { get; set; }
    }
}
