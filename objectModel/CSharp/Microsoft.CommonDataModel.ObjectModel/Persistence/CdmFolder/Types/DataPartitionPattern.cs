// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types
{
    using System.Collections.Generic;

    using Newtonsoft.Json.Linq;

    /// <summary>
    /// The representation of data partition pattern in the CDM Folders format.
    /// </summary>
    public class DataPartitionPattern : FileStatus
    {
        /// <summary>
        /// Gets or sets the name for the pattern.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the explanation for the pattern.
        /// </summary>
        public string Explanation { get; set; }

        /// <summary>
        /// Gets or sets the starting location corpus path for searching for inferred data partitions.
        /// </summary>
        public string RootLocation { get; set; }

        /// <summary>
        /// Gets or sets the glob pattern string to use for searching partitions.
        /// </summary>
        public string GlobPattern { get; set; }

        /// <summary>
        /// Gets or sets the regular expression string to use for searching partitions.
        /// </summary>
        public string RegularExpression { get; set; }

        /// <summary>
        /// Gets or sets the names for replacement values from regular expression.
        /// </summary>
        public List<string> Parameters { get; set; }

        /// <summary>
        /// Gets or sets the corpus path for specialized schema to use for matched pattern partitions.
        /// </summary>
        public string SpecializedSchema { get; set; }

        /// <summary>
        /// Gets or sets the exhibited traits.
        /// </summary>
        public List<JToken> ExhibitsTraits { get; set; }

        /// <inheritdoc />
        public string LastFileStatusCheckTime { get; set; }

        /// <inheritdoc />
        public string LastFileModifiedTime { get; set; }
        public string LastChildFileModifiedTime { get; set; }
    }
}
