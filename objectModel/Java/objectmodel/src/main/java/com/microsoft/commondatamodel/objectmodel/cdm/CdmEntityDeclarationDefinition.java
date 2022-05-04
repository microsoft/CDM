// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

public interface CdmEntityDeclarationDefinition extends CdmObjectDefinition, CdmFileStatus {

  /**
   * Gets or sets the entity name.
   * @return String
   */
  String getEntityName();

  void setEntityName(String value);

  /**
   * Gets or sets the entity schema.
   * @return String
   */
  String getEntityPath();

  void setEntityPath(String value);

  /**
   * Gets the data partitions, implemented only by CdmLocalEntityDeclarationDefinition.
   * @return CdmCollection of CdmDataPartitionDefinition
   */
  CdmCollection<CdmDataPartitionDefinition> getDataPartitions();

  /**
   * Gets the data partition patterns, implemented only by CdmLocalEntityDeclarationDefinition.
   * @return CdmCollection of CdmDataPartitionPatternDefinition
   */
  CdmCollection<CdmDataPartitionPatternDefinition> getDataPartitionPatterns();

  /**
   * Gets the incremental partitions, implemented only by CdmLocalEntityDeclarationDefinition.
   * @return CdmCollection of CdmDataPartitionDefinition
   */
  CdmCollection<CdmDataPartitionDefinition> getIncrementalPartitions();

  /**
   * Gets the incremental partition patterns, implemented only by CdmLocalEntityDeclarationDefinition.
   * @return CdmCollection of CdmDataPartitionPatternDefinition
   */
  CdmCollection<CdmDataPartitionPatternDefinition> getIncrementalPartitionPatterns();
}
