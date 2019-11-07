// --------------------------------------------------------------------------------------------------------------------
// <copyright file="DataPartition.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
// <summary>
//   The representation of data partition in CDM Folders format.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types
{
    using System.Collections.Generic;

    using Newtonsoft.Json.Linq;

    /// <summary>
    /// The representation of data partition in CDM Folders format.
    /// </summary>
    public class DataPartition : FileStatus
    {
        /// <summary>
        /// Gets or sets the corpus path for the data file location.
        /// </summary>
        public string Location { get; set; }

        /// <summary>
        /// Gets or sets the exhibited traits.
        /// </summary>
        public List<JToken> ExhibitsTraits { get; set; }

        /// <summary>
        /// Gets or sets the list of key value pairs to give names for the replacement values from the RegEx.
        /// </summary>
        public List<KeyValuePair<string, string>> Arguments { get; set; }

        /// <summary>
        /// Gets or sets the path of a specialized schema to use specifically for the partitions generated.
        /// </summary>
        public string SpecializedSchema { get; set; }

        /// <inheritdoc />
        public string LastFileStatusCheckTime { get; set; }

        /// <inheritdoc />
        public string LastFileModifiedTime { get; set; }

        public string LastChildFileModifiedTime { get; set; }
    }
}