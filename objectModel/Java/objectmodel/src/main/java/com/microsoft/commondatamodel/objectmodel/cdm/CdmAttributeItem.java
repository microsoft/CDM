// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

/**
 * The CDM Def interface for a generic attribute that could be a type, entity, or group attribute.
 */
public interface CdmAttributeItem extends CdmObject, CdmReferencesEntities {

  /**
   * Gets the attribute applied traits.
   * @return Cdm Trait Collection
   */
  CdmTraitCollection getAppliedTraits();
}
