// <copyright file="SingleKeyRelationship.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.ObjectModel
{
    using System.IO;
    using Newtonsoft.Json;

    /// <summary>
    /// A relation ship of with a single key to a field.
    /// </summary>
    [JsonObject(MemberSerialization.OptIn)]
    public class SingleKeyRelationship : Relationship
    {
        /// <summary>
        /// Gets or sets the FromAttribute
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public AttributeReference FromAttribute { get; set; }

        /// <summary>
        /// Gets or sets the ToAttribute
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public AttributeReference ToAttribute { get; set; }

        /// <inheritdoc/>
        internal override void Validate()
        {
            base.Validate();

            if (this.FromAttribute == null)
            {
                throw new InvalidDataException($"'{nameof(SingleKeyRelationship)}' - '{nameof(this.FromAttribute)}' is not set.");
            }

            if (this.ToAttribute == null)
            {
                throw new InvalidDataException($"'{nameof(SingleKeyRelationship)}' - '{nameof(this.ToAttribute)}' is not set.");
            }

            this.FromAttribute.Validate();
            this.ToAttribute.Validate();

            if (ReferenceEquals(this.FromAttribute, this.ToAttribute))
            {
                throw new InvalidDataException($"'{nameof(SingleKeyRelationship)}' must exist between different attribute references.");
            }
        }

        /// <inheritdoc/>
        public override object Clone()
        {
            var clone = (SingleKeyRelationship)base.Clone();
            clone.FromAttribute = (AttributeReference)this.FromAttribute?.Clone();
            clone.ToAttribute = (AttributeReference)this.ToAttribute?.Clone();

            return clone;
        }
    }
}