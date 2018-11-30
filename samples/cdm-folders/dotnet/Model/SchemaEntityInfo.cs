
namespace Microsoft.CdmFolders.SampleLibraries
{
    /// <summary>
    /// Entity information stored in a schema
    /// </summary>
    public class SchemaEntityInfo
    {
        /// <summary>
        /// Gets or sets the entity name
        /// </summary>
        public string EntityName { get; set; }

        /// <summary>
        /// Gets or sets the entity version
        /// </summary>
        public string EntityVersion { get; set; }

        /// <summary>
        /// Gets or sets the entity namespace
        /// </summary>
        public string EntityNamespace { get; set; }

        /// <inheritdoc/>
        public override string ToString()
        {
            return string.IsNullOrEmpty(this.EntityNamespace) ?
                $"{this.EntityName}.{this.EntityVersion}.json" :
                $"{this.EntityNamespace}/{this.EntityName}.{this.EntityVersion}.json";
        }
    }
}
