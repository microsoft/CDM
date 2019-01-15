// <copyright file="LocalEntity.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace Microsoft.CdmFolders.ObjectModel
{
    using Microsoft.CdmFolders.ObjectModel.SerializationHelpers;
    using Newtonsoft.Json;

    /// <summary>
    /// Represents an entity that belongs to the current model.
    /// </summary>
    [JsonObject(MemberSerialization.OptIn)]
    public class LocalEntity : Entity
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="LocalEntity"/> class.
        /// </summary>
        public LocalEntity()
        {
            this.Attributes = new AttributeCollection();
            this.Partitions = new PartitionCollection();
            this.Schemas = new SchemaCollection();
        }

        /// <summary>
        /// Gets or sets the Attributes
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore, Order = SerializationOrderConstants.CollectionSerializationOrder)]
        public AttributeCollection Attributes { get; set; }

        /// <summary>
        /// Gets or sets the schemas the entity implements
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore, Order = SerializationOrderConstants.CollectionSerializationOrder)]
        public PartitionCollection Partitions { get; set; }

        /// <summary>
        /// Gets or sets the schemas the entity implements
        /// </summary>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore, Order = SerializationOrderConstants.CollectionSerializationOrder)]
        public SchemaCollection Schemas { get; set; }

        /// <inheritdoc/>
        internal override void Validate()
        {
            base.Validate();

            this.Attributes.Validate();
            this.Partitions.Validate();
            this.Schemas.Validate();
        }

        /// <inheritdoc/>
        public override object Clone()
        {
            var clone = (LocalEntity)base.Clone();
            clone.Attributes = (AttributeCollection)this.Attributes?.Clone();
            clone.Partitions = (PartitionCollection)this.Attributes?.Clone();
            clone.Schemas = (SchemaCollection)this.Attributes?.Clone();

            return clone;
        }
    }
}