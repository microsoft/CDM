// <copyright file="Partition.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.ObjectModel
{
    using System;
    using Microsoft.CdmFolders.ObjectModel.SerializationHelpers;
    using Newtonsoft.Json;

    /// <summary>
    /// Represents the name and location of the actual data 
    /// files corresponding to the entity definition.
    /// </summary>
    [JsonObject(MemberSerialization.OptIn)]
    public class Partition : DataObject
    {
        /// <summary>
        /// Gets or sets the Refresh Time
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public DateTimeOffset? RefreshTime { get; set; }

        /// <summary>
        /// Gets or sets location
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Uri Location { get; set; }

        /// <summary>
        /// Gets or sets file format settings
        /// </summary>
        /// <remarks>The usage of <see cref="TypeNameHandling.Auto"/> is ok since the TypeNameSerializationBinder limits the scope only to this assembly</remarks>
        [JsonProperty(TypeNameHandling = TypeNameHandling.Auto, NullValueHandling = NullValueHandling.Ignore, Order = SerializationOrderConstants.ObjectSerializationOrder)]
        public FileFormatSettings FileFormatSettings { get; set; }

        /// <inheritdoc/>
        public override object Clone()
        {
            var clone = (Partition)base.Clone();
            clone.Location = (this.Location == null) ? null : new UriBuilder(this.Location).Uri;
            clone.FileFormatSettings = (FileFormatSettings)clone.FileFormatSettings?.Clone();

            return clone;
        }
    }
}
