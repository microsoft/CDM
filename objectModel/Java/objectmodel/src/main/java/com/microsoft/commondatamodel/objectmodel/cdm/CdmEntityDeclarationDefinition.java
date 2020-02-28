// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

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
