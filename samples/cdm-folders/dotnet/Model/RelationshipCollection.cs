
namespace Microsoft.CdmFolders.SampleLibraries
{
    using Newtonsoft.Json;

    /// <summary>
    /// RelationshipCollectio
    /// </summary>
    /// <remarks>The usage of <see cref="TypeNameHandling.Auto"/> was approved in this by Azure security team since the TypeNameSerializationBinder limis the scope only to this assembly</remarks>
    [JsonArray(ItemTypeNameHandling = TypeNameHandling.Auto)]
    public class RelationshipCollection : MetadataObjectCollection<Relationship, Model>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="RelationshipCollection"/> class.
        /// </summary>
        /// <param name="parent">The parent</param>
        public RelationshipCollection(Model parent)
            : base(parent)
        {
        }
    }
}
