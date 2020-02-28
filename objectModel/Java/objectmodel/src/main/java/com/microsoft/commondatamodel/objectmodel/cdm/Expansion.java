// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

/**
 * Parameters that control array expansion if inline repeating of attributes is needed.
 */
public class Expansion {
  public Integer startingOrdinal;
  public Integer maximumExpansion;
  public CdmTypeAttributeDefinition countAttribute;

  public Integer getStartingOrdinal() {
    return this.startingOrdinal;
  }

  public void setStartingOrdinal(final Integer value) {
    this.startingOrdinal = value;
  }

  /**
   * @return the greatest number of time that the attribute pattern should be repeated.
   */
  public Integer getMaximumExpansion() {
    return this.maximumExpansion;
  }

  /**
   * @param value the greatest number of time that the attribute pattern should be repeated.
   */
  public void setMaximumExpansion(final Integer value) {
    this.maximumExpansion = value;
  }

  /**
   * @return The supplied attribute definition will be added to the Entity to represent the total number of instances found in the data.
   */
  public CdmTypeAttributeDefinition getCountAttribute() {
    return this.countAttribute;
  }

  /**
   * @param value The supplied attribute definition will be added to the Entity to represent the total number of instances found in the data.
   */
  public void setCountAttribute(final CdmTypeAttributeDefinition value) {
    this.countAttribute = value;
  }
}
