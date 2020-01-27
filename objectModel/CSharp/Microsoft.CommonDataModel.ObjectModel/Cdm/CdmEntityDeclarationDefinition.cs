// --------------------------------------------------------------------------------------------------------------------
// <copyright file="CdmLocalEntityDeclarationDefinition.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    public interface CdmEntityDeclarationDefinition : CdmObjectDefinition, CdmFileStatus
    {
        /// <summary>
        /// Gets or sets the entity name.
        /// </summary>
        string EntityName { get; set; }

        /// <summary>
        /// Gets or sets the entity path.
        /// </summary>
        string EntityPath { get; set; }

        /// <summary>
        /// Gets the data partitions, implemented only by LocalEntityDeclaration.
        /// </summary>
        CdmCollection<CdmDataPartitionDefinition> DataPartitions { get; }

        /// <summary>
        /// Gets the data partition patterns, implemented only by LocalEntityDeclaration.
        /// </summary>
        CdmCollection<CdmDataPartitionPatternDefinition> DataPartitionPatterns { get; }
    }
}
