// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;

public class CdmPurposeReference extends CdmObjectReferenceBase {

  public CdmPurposeReference(
      final CdmCorpusContext ctx,
      final Object purpose,
      final boolean simpleReference) {
    super(ctx, purpose, simpleReference);
    this.setObjectType(CdmObjectType.PurposeRef);
  }

  /**
   *
   * @param resOpt Resolved options
   * @param refTo ref object
   * @param simpleReference boolean simple reference
   * @return CdmObjectReferenceBase
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public CdmObjectReferenceBase copyRefObject(
      final ResolveOptions resOpt,
      final Object refTo,
      final boolean simpleReference) {
    return this.copyRefObject(resOpt, refTo, simpleReference, null);
  }

  /**
   * @param resOpt Resolved options
   * @param refTo ref object
   * @param simpleReference boolean simple reference
   * @return CdmObjectReferenceBase
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public CdmObjectReferenceBase copyRefObject(
      final ResolveOptions resOpt,
      final Object refTo,
      final boolean simpleReference,
      CdmObjectReferenceBase host) {
    if (host == null) {
      return new CdmPurposeReference(this.getCtx(), refTo, simpleReference);
    } else {
      return host.copyToHost(this.getCtx(), refTo, simpleReference);
    }
  }

  /**
   *
   * @param pathRoot path root
   * @param preChildren Pre children
   * @param postChildren post children
   * @return boolean
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public boolean visitRef(final String pathRoot, final VisitCallback preChildren, final VisitCallback postChildren) {
    return false;
  }

  /**
   *
   * @param resOpt Resolved option
   * @param options copy options
   * @return object
   * @deprecated CopyData is deprecated. Please use the Persistence Layer instead. This function is
   * extremely likely to be removed in the public interface, and not meant to be called externally
   * at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public Object copyData(final ResolveOptions resOpt, final CopyOptions options) {
    return CdmObjectBase.copyData(this, resOpt, options, CdmPurposeReference.class);
  }
}
