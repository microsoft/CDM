
namespace Microsoft.CdmFolders.SampleLibraries
{
    /// <summary>
    /// Relationship
    /// </summary>
    public abstract class Relationship : MetadataObject
    {
        /// <inheritdoc/>
        protected override int NameLengthMax => 1024;
    }
}