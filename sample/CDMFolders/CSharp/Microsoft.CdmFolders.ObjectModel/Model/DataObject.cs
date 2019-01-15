// <copyright file="DataObject.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.ObjectModel
{
    using System.IO;
    using Microsoft.CdmFolders.ObjectModel.SerializationHelpers;
    using Newtonsoft.Json;

    /// <summary>
    /// Defines a base class for a data object.
    /// </summary>
    [JsonObject(MemberSerialization.OptIn)]
    public abstract class DataObject : MetadataObject
    {
        /// <summary>
        /// Gets or sets a value indicating whether this object is hidden
        /// </summary>
        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore, Order = SerializationOrderConstants.DataObjectSerializationOrder)]
        public bool IsHidden { get; set; }

        /// <inheritdoc/>
        internal override void Validate()
        {
            base.Validate();

            if (this.Name == null)
            {
                throw new InvalidDataException($"Name is not set for '{this.GetType().Name}'.");
            }
        }
    }
}