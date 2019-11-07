// Copyright (c) Microsoft Corporation.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedEntityReferenceSet;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;

public class CdmAttributeGroupReference extends CdmObjectReferenceBase implements CdmAttributeItem {

  private CdmCollection<CdmAttributeItem> members;

  public CdmAttributeGroupReference(
      final CdmCorpusContext ctx,
      final Object attributeGroup,
      final boolean simpleReference) {
    super(ctx, attributeGroup, simpleReference);
    this.setObjectType(CdmObjectType.AttributeGroupRef);
  }

  /**
   *
   * @param resOpt
   * @param refTo
   * @param simpleReference
   * @return
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public CdmObjectReferenceBase copyRefObject(final ResolveOptions resOpt, final Object refTo, final boolean simpleReference) {
    return new CdmAttributeGroupReference(this.getCtx(), refTo, simpleReference);
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
    return CdmObjectBase.copyData(this, resOpt, options, CdmAttributeGroupReference.class);
  }

  public ResolvedEntityReferenceSet fetchResolvedEntityReferences(final ResolveOptions resOpt) {
    final CdmObjectDefinition cdmObjectDefinition = this.fetchResolvedReference(resOpt);
    if (cdmObjectDefinition != null) {
      return ((CdmAttributeGroupDefinition) cdmObjectDefinition).fetchResolvedEntityReferences(resOpt);
    }
    if (this.getExplicitReference() != null) {
      return ((CdmAttributeGroupDefinition) this.getExplicitReference()).fetchResolvedEntityReferences(resOpt);
    }
    return null;
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

  public CdmCollection<CdmAttributeItem> getMembers() {
    if (this.members == null) {
      this.members = new CdmCollection<>(this.getCtx(), this, CdmObjectType.TypeAttributeDef);
    }
    return this.members;
  }
}