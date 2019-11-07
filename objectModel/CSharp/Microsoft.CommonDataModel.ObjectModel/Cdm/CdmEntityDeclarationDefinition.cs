// --------------------------------------------------------------------------------------------------------------------
// <copyright file="CdmLocalEntityDeclarationDefinition.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
// <summary>
//   The CDM Def interface for Local Entity Declaration.
// </summary>
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
        /// Gets or sets the entity path, implemented only by LocalEntityDeclaration.
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
