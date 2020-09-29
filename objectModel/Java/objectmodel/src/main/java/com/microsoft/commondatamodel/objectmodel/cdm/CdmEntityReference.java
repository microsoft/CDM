// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;

public class CdmEntityReference extends CdmObjectReferenceBase implements CdmObjectReference {

  public CdmEntityReference(final CdmCorpusContext ctx, final Object entityRef, final boolean simpleReference) {
    super(ctx, entityRef, simpleReference);
    this.setObjectType(CdmObjectType.EntityRef);
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @param resOpt Resolved Options
   * @param refTo Object reference
   * @param simpleReference Simple reference
   * @return CdmObjectReferenceBase
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
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @param resOpt Resolved Options
   * @param refTo Object reference
   * @param simpleReference Simple reference
   * @param host Host
   * @return CdmObjectReferenceBase
   */
  @Override
  @Deprecated
  public CdmObjectReferenceBase copyRefObject(
      final ResolveOptions resOpt,
      final Object refTo,
      final boolean simpleReference,
      final CdmObjectReferenceBase host) {
    if (host == null) {
      return new CdmEntityReference(this.getCtx(), refTo, simpleReference);
    } else {
      return host.copyToHost(this.getCtx(), refTo, simpleReference);
    }
  }

  /**
   *
   * @param resOpt Resolved options
   * @param options Copy options
   * @return Object
   * @deprecated CopyData is deprecated. Please use the Persistence Layer instead. This function is
   * extremely likely to be removed in the public interface, and not meant to be called externally
   * at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public Object copyData(final ResolveOptions resOpt, final CopyOptions options) {
    return CdmObjectBase.copyData(this, resOpt, options, CdmEntityReference.class);
  }

  /**
   *
   * @param pathRoot Path root
   * @param preChildren Pre children
   * @param postChildren Post children
   * @return Boolean
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public boolean visitRef(final String pathRoot, final VisitCallback preChildren, final VisitCallback postChildren) {
    return false;
  }
}
