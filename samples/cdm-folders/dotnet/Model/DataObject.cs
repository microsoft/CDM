
namespace Microsoft.CdmFolders.SampleLibraries
{
    using System;
    using System.IO;
    using Microsoft.CdmFolders.SampleLibraries.SerializationHelpers;
    using Newtonsoft.Json;

    /// <summary>
    /// MetadataObject
    /// </summary>
    [JsonObject(MemberSerialization.OptIn)]
    public abstract class DataObject : MetadataObject
    {
        /// <summary>
        /// Gets or sets a value indicating whether this object is hidden
        /// </summary>
        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore, Order = SerializationOrderConstants.DataObjectSerializationOrder)]
        public bool IsHidden { get; set; }

        private DataObject DataObjectParent => this.Parent as DataObject;

        /// <inheritdoc/>
        internal override void Validate(bool allowUnresolvedModelReferences = true)
        {
            base.Validate(allowUnresolvedModelReferences);

            if (this.Name == null)
            {
                throw new InvalidDataException($"Name is not set for '{this.GetType().Name}'.");
            }
        }
        
        /// <summary>
        /// Copy from other data object
        /// </summary>
        /// <param name="other">the other data object</param>
        protected void CopyFrom(DataObject other)
        {
            base.CopyFrom(other);
            this.IsHidden = other.IsHidden;
        }
    }
}