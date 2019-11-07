// --------------------------------------------------------------------------------------------------------------------
// <copyright file="ManifestDeclaration.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
// <summary>
//   The folder declaration for CDM manifest format.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types
{
    /// <summary>
    /// The manifest declaration for CDM manifest format.
    /// </summary>
    public class ManifestDeclaration : FileStatus
    {
        /// <summary>
        /// Gets or sets the explanation.
        /// </summary>
        public string Explanation { get; set; }

        /// <summary>
        /// Gets or sets the manifest name.
        /// </summary>
        public string ManifestName { get; set; }

        /// <summary>
        /// Gets or sets the corpus path to the definition of the sub manifest.
        /// </summary>
        public string Definition { get; set; }

        /// <inheritdoc />
        public string LastFileStatusCheckTime { get; set; }

        /// <inheritdoc />
        public string LastFileModifiedTime { get; set; }

        /// <inheritdoc />
        public string LastChildFileModifiedTime { get; set; }
    }
}