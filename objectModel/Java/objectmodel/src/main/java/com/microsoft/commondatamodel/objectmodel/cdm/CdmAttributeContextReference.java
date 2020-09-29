// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;

public class CdmAttributeContextReference extends CdmObjectReferenceBase {

  public CdmAttributeContextReference(final CdmCorpusContext ctx, final String name) {
    super(ctx, name, true);
    this.setObjectType(CdmObjectType.AttributeContextRef);
  }


  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @param resOpt Resolved options
   * @param refTo Object
   * @param simpleReference boolean
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
   * @param resOpt Resolved options
   * @param refTo Object
   * @param simpleReference boolean
   * @param host host
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
      return new CdmAttributeContextReference(this.getCtx(), refTo.toString());
    } else {
      return host.copyToHost(this.getCtx(), refTo, simpleReference);
    }
  }

  /**
   *
   * @param resOpt Resolved options
   * @param options Copy Option
   * @return Object
   * @deprecated CopyData is deprecated. Please use the Persistence Layer instead. This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public Object copyData(final ResolveOptions resOpt, final CopyOptions options) {
    return CdmObjectBase.copyData(this, resOpt, options, CdmAttributeContextReference.class);
  }

  /**
   *
   * @param pathRoot path root
   * @param preChildren Pre Children
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
}
