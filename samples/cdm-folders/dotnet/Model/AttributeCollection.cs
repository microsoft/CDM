
namespace Microsoft.CdmFolders.SampleLibraries
{
    using System;
    using System.Linq;

    /// <summary>
    /// AttributeCollection
    /// </summary>
    public class AttributeCollection : MetadataObjectCollection<Attribute, Entity>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="AttributeCollection"/> class.
        /// </summary>
        /// <param name="parent">The parent</param>
        public AttributeCollection(Entity parent)
            : base(parent)
        {
        }

        /// <inheritdoc/>
        internal override void Validate(bool allowUnresolvedModelReferences = true)
        {
            base.Validate(allowUnresolvedModelReferences);
            this.ValidateUniqueNames();
        }
    }
}