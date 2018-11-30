// <copyright file="SingleKeyRelationship.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.SampleLibraries
{
    using System;
    using System.IO;
    using System.Linq;
    using Newtonsoft.Json;

    /// <summary>
    /// SingleKeyRelationship
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
        internal override void Validate(bool allowUnresolvedModelReferences = true)
        {
            base.Validate(allowUnresolvedModelReferences);

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
    }
}