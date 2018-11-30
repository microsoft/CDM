
namespace Microsoft.CdmFolders.SampleLibraries
{
    using Microsoft.CdmFolders.SampleLibraries.SerializationHelpers;
    using Newtonsoft.Json;

    /// <summary>
    /// Entity
    /// </summary>
    [JsonObject(MemberSerialization.OptIn)]
    public class LocalEntity : Entity
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="LocalEntity"/> class.
        /// </summary>
        public LocalEntity()
        {
            this.Attributes = new AttributeCollection(this);
            this.Partitions = new PartitionCollection(this);
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
        internal override void Validate(bool allowUnresolvedModelReferences = true)
        {
            base.Validate(allowUnresolvedModelReferences);

            this.Attributes.Validate(allowUnresolvedModelReferences);
            this.Partitions.Validate(allowUnresolvedModelReferences);
            this.Schemas.Validate();
        }
    }
}