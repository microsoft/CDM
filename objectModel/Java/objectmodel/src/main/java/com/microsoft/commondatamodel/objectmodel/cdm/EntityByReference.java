// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

/**
 * Parameters that control the use of foreign keys to reference entity instances instead of imbedding the entity in a nested way.
 * @deprecated
 * Resolution guidance is being deprecated in favor of Projections. https://docs.microsoft.com/en-us/common-data-model/sdk/convert-logical-entities-resolved-entities#projection-overview
 */
public class EntityByReference {
  private Boolean allowReference;
  private Boolean alwaysIncludeForeignKey;
  private Integer referenceOnlyAfterDepth;
  private CdmTypeAttributeDefinition foreignKeyAttribute;

  /**
   * @return explicitly, is a reference allowed?
   */
  public Boolean doesAllowReference() {
    return this.allowReference;
  }

  /**
   * @param value explicitly, is a reference allowed?
   */
  public void setAllowReference(final Boolean value) {
    this.allowReference = value;
  }

  /**
   * @return if true, a foreign key attribute will be added to the entity even when the entity attribute is imbedded in a nested way.
   */
  public Boolean doesAlwaysIncludeForeignKey() {
    return this.alwaysIncludeForeignKey;
  }

  /**
   * @param value if true, a foreign key attribute will be added to the entity even when the entity attribute is imbedded in a nested way.
   */
  public void setAlwaysIncludeForeignKey(final Boolean value) {
    this.alwaysIncludeForeignKey = value;
  }

  /**
   * @return After a given depth of non-reference nesting using entity attributes, the 'referenceOnly' directive will be imposed.
   */
  public Integer getReferenceOnlyAfterDepth() {
    return this.referenceOnlyAfterDepth;
  }

  /**
   * @param value After a given depth of non-reference nesting using entity attributes, the 'referenceOnly' directive will be imposed.
   */
  public void setReferenceOnlyAfterDepth(final Integer value) {
    this.referenceOnlyAfterDepth = value;
  }

  /**
   * @return The supplied attribute definition will be added to the Entity to hold a foreign key value for the referenced entity.
   */
  public CdmTypeAttributeDefinition getForeignKeyAttribute() {
    return this.foreignKeyAttribute;
  }

  /**
   * @param value The supplied attribute definition will be added to the Entity to hold a foreign key value for the referenced entity.
   */
  public void setForeignKeyAttribute(final CdmTypeAttributeDefinition value) {
    this.foreignKeyAttribute = value;
  }
}
