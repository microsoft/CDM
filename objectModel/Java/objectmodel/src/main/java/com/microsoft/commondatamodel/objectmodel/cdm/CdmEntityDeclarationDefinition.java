// Copyright (c) Microsoft Corporation.

package com.microsoft.commondatamodel.objectmodel.cdm;

public interface CdmEntityDeclarationDefinition extends CdmObjectDefinition, CdmFileStatus {

  /**
   * Gets or sets the entity name.
   */
  String getEntityName();

  void setEntityName(String value);

  /**
   * Gets or sets the entity schema.
   */
  String getEntityPath();

  void setEntityPath(String value);

  /**
   * Gets the data partitions, implemented only by CdmLocalEntityDeclarationDefinition.
   */
  CdmCollection<CdmDataPartitionDefinition> getDataPartitions();

  /**
   * Gets the data partition patterns, implemented only by CdmLocalEntityDeclarationDefinition.
   */
  CdmCollection<CdmDataPartitionPatternDefinition> getDataPartitionPatterns();
}
