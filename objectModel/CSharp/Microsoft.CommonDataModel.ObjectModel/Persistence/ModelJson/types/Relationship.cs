// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

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
