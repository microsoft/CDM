// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson.types
{
    using Newtonsoft.Json;
    using System;

    /// <summary>
    /// Represents the name and location of the actual data 
    /// files corresponding to the entity definition.
    /// If you make changes to this class, please note a custom serializer is used <see cref="CustomSerializer"/>
    /// </summary>
    public class Partition : DataObject
    {
        [JsonProperty("refreshTime", NullValueHandling = NullValueHandling.Ignore)]
        public DateTimeOffset? RefreshTime { get; set; }

        [JsonProperty("location")]
        public string Location { get; set; }

        [JsonProperty("fileFormatSettings")]
        public CsvFormatSettings FileFormatSettings { get; set; }

        [JsonProperty("cdm:lastFileStatusCheckTime", NullValueHandling = NullValueHandling.Ignore)]
        public DateTimeOffset? LastFileStatusCheckTime { get; set; }

        [JsonProperty("cdm:lastFileModifiedTime", NullValueHandling = NullValueHandling.Ignore)]
        public DateTimeOffset? LastFileModifiedTime { get; set; }
    }
}
