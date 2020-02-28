// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;

public class CdmDataTypeReference extends CdmObjectReferenceBase implements CdmObjectReference {

  // TODO-BQ : Object as a placeholder for Dynamic keyword.
  public CdmDataTypeReference(final CdmCorpusContext ctx, final Object dataType, final boolean simpleReference) {
    super(ctx, dataType, simpleReference);
    this.setObjectType(CdmObjectType.DataTypeRef);
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
   * @return
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public CdmObjectReferenceBase copyRefObject(
      final ResolveOptions resOpt,
      final Object refTo,
      final boolean simpleReference, CdmObjectReferenceBase host) {
    if (host == null) {
      return new CdmDataTypeReference(this.getCtx(), refTo, simpleReference);
    } else {
      return host.copyToHost(this.getCtx(), refTo, simpleReference);
    }
  }

  /**
   *
   * @param resOpt
   * @param options
   * @return
   * @deprecated CopyData is deprecated. Please use the Persistence Layer instead. This function is
   * extremely likely to be removed in the public interface, and not meant to be called externally
   * at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public Object copyData(final ResolveOptions resOpt, final CopyOptions options) {
    return CdmObjectBase.copyData(this, resOpt, options, CdmDataTypeReference.class);
  }

  /**
   *
   * @param pathRoot
   * @param preChildren
   * @param postChildren
   * @return
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public boolean visitRef(final String pathRoot, final VisitCallback preChildren, final VisitCallback postChildren) {
    return false;
  }
}
