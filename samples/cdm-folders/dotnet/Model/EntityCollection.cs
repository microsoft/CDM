
namespace Microsoft.CdmFolders.SampleLibraries
{
    using Newtonsoft.Json;

    /// <summary>
    /// EntityCollectio
    /// </summary>
    /// <remarks>The usage of <see cref="TypeNameHandling.Auto"/> was approved in this by Azure security team since the TypeNameSerializationBinder limits the scope only to this assembly</remarks>
    [JsonArray(ItemTypeNameHandling = TypeNameHandling.Auto)]
    public class EntityCollection : MetadataObjectCollection<Entity, Model>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="EntityCollection"/> class.
        /// </summary>
        /// <param name="parent">The parent</param>
        public EntityCollection(Model parent)
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