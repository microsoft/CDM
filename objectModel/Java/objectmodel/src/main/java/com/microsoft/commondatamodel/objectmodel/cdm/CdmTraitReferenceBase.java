// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

/**
 * The CDM definition interface for a generic reference to either a trait or a trait group.
 */
public abstract class CdmTraitReferenceBase extends CdmObjectReferenceBase {
  public CdmTraitReferenceBase(final CdmCorpusContext ctx, final Object referenceTo, boolean simpleReference) {
    super(ctx, referenceTo, simpleReference);
  }
}
