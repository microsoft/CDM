// <copyright file="ReferenceEntity.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.ObjectModel
{
    using System.IO;
    using Newtonsoft.Json;

    /// <summary>
    ///  Represents an entity that belongs to an external model.
    /// </summary>
    [JsonObject(MemberSerialization.OptIn)]
    public class ReferenceEntity : Entity
    {
        /// <summary>
        /// Gets or sets Referenced Entity Name
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Source { get; set; }

        /// <summary>
        /// Gets or sets Referenced Model Id
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string ModelId { get; set; }

        /// <inheritdoc/>
        internal override void Validate()
        {
            base.Validate();

            if (string.IsNullOrWhiteSpace(this.Source))
            {
                throw new InvalidDataException($"{nameof(this.Source)} is not set for '{this.GetType().Name}'.");
            }

            if (string.IsNullOrWhiteSpace(this.ModelId))
            {
                throw new InvalidDataException($"{nameof(this.ModelId)} is not set for '{this.GetType().Name}'.");
            }
        }
    }
}