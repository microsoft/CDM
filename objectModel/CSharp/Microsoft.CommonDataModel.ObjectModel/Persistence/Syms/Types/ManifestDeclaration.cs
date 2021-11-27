// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.Syms.Types
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
