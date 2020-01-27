// Copyright (c) Microsoft Corporation.

package com.microsoft.commondatamodel.objectmodel.cdm;

/**
 * The CDM Def interface for a generic attribute that could be a type, entity, or group attribute.
 */
public interface CdmAttributeItem extends CdmObject, CdmReferencesEntities {

  /**
   * Gets the attribute applied traits.
   */
  CdmTraitCollection getAppliedTraits();
}
