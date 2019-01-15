// <copyright file="Attribute.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.ObjectModel
{
    using System;
    using Newtonsoft.Json;

    /// <summary>
    /// Represents a field within an entity.
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
