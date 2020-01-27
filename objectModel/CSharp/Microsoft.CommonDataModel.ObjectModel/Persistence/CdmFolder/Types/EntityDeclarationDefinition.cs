// --------------------------------------------------------------------------------------------------------------------
// <copyright file="EntityDeclaration.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
// <summary>
//   The entity declaration for CDM folders format.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types
{
    using System;
    using System.Collections.Generic;
    using Newtonsoft.Json.Linq;

    public class EntityDeclarationDefinition
    {
        /// <summary>
        /// The entity declaration type, can be local or referenced.
        /// </summary>
        public string Type { get; set; }

        /// <summary>
        /// Gets or sets the entity name.
        /// </summary>
        public string EntityName { get; set; }

        /// <summary>
        /// Gets or sets the explanation.
        /// </summary>
        public string Explanation { get; set; }

        /// <summary>
        /// Gets or sets the exhibited traits.
        /// </summary>
        public List<JToken> ExhibitsTraits { get; set; }

        [ObsoleteAttribute]
        /// <summary>
        /// Gets or sets the entity schema.
        /// </summary>
        public string EntitySchema { get; set; }

        [ObsoleteAttribute]
        /// <summary>
        /// Gets or sets the entity declaration.
        /// </summary>
        public string EntityDeclaration { get; set; }

        /// <summary>
        /// Gets or sets the entity path.
        /// </summary>
        public string EntityPath { get; set; }

        /// <summary>
        /// Gets or sets the data partitions.
        /// </summary>
        public List<DataPartition> DataPartitions { get; set; }

        /// <summary>
        /// Gets or sets the data partition patterns.
        /// </summary>
        public List<DataPartitionPattern> DataPartitionPatterns { get; set; }

        /// <summary>
        /// The last file status check time.
        /// </summary>
        public string LastFileStatusCheckTime { get; set; }

        /// <summary>
        /// The last file modified time.
        /// </summary>
        public string LastFileModifiedTime { get; set; }

        /// <summary>
        /// The last child file modified time.
        /// </summary>
        public string LastChildFileModifiedTime { get; set; }
    }

    public class EntityDeclarationDefinitionType
    {
        public const string LocalEntity = "LocalEntity";

        public const string ReferencedEntity = "ReferencedEntity";
    }
}
