// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

namespace Microsoft.CdmFolders.SampleLibraries
{
    using Newtonsoft.Json;

    /// <summary>
    /// Attribute
    /// </summary>
    [JsonObject(MemberSerialization.OptIn)]
    public class Attribute : MetadataObject
    {
        /// <summary>
        /// Gets or sets the DataType
        /// </summary>
        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
        public DataType DataType { get; set; }
    }
}
