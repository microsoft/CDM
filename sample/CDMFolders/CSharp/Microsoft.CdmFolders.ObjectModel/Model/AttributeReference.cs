// <copyright file="AttributeReference.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.ObjectModel
{
    using System;
    using System.IO;
    using Newtonsoft.Json;

    /// <summary>
    /// Defines a field to refer to an entity.
    /// </summary>
    [JsonObject(MemberSerialization.OptIn)]
    public class AttributeReference : ICloneable
    {
        /// <summary>
        /// Gets or sets entity
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string EntityName { get; set; }

        /// <summary>
        /// Gets or sets attribute
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string AttributeName { get; set; }

        /// <inheritdoc/>
        public virtual object Clone()
        {
            return this.MemberwiseClone();
        }

        /// <summary>
        /// Validates that loaded <see cref="AttributeReference"/> is correct and can function.
        /// </summary>
        internal void Validate()
        {
            if (string.IsNullOrWhiteSpace(this.EntityName))
            {
                throw new InvalidDataException($"{nameof(this.EntityName)} is not set for '{this.GetType().Name}'.");
            }

            if (string.IsNullOrWhiteSpace(this.AttributeName))
            {
                throw new InvalidDataException($"{nameof(this.AttributeName)} is not set for '{this.GetType().Name}'.");
            }
        }
    }
}