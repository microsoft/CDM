// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.utilities.*;

public class CdmTraitGroupReference extends CdmTraitReferenceBase {
  /**
   * Constructs a CdmTraitGroupReference.
   *
   * @param ctx             The context.
   * @param trait           The TraitGroup to reference.
   * @param simpleReference Whether this reference is a simple reference
   */
  public CdmTraitGroupReference(final CdmCorpusContext ctx, final Object trait, final boolean simpleReference) {
    super(ctx, trait, simpleReference);
    this.setObjectType(CdmObjectType.TraitGroupRef);
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public CdmObjectReferenceBase copyRefObject(
          final ResolveOptions resOpt,
          final Object refTo,
          final boolean simpleReference) {
      return copyRefObject(resOpt, refTo, simpleReference, null);
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public CdmObjectReferenceBase copyRefObject(
          final ResolveOptions resOpt,
          final Object refTo,
          final boolean simpleReference,
          final CdmObjectReferenceBase host) {
    if (host == null)
      return new CdmTraitGroupReference(getCtx(), refTo, simpleReference);
    else
      return host.copyToHost(getCtx(), refTo, simpleReference);
  }

  /**
   * @param resOpt  Resolved option
   * @param options copy options
   * @return Object
   * @deprecated CopyData is deprecated. Please use the Persistence Layer instead. This function is
   * extremely likely to be removed in the public interface, and not meant to be called externally
   * at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public Object copyData(final ResolveOptions resOpt, final CopyOptions options) {
    return CdmObjectBase.copyData(this, resOpt, options, CdmTraitGroupReference.class);
  }

  @Override
  @Deprecated
  public boolean visitRef(final String pathFrom, final VisitCallback preChildren, final VisitCallback postChildren) {
    return false;
  }
}