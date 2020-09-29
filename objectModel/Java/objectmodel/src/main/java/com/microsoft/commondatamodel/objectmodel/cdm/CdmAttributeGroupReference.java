// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

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
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @param resOpt Resolved options
   * @param refTo Ref object
   * @param simpleReference simple reference
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
   * @param refTo Ref object
   * @param simpleReference simple reference
   * @param host host reference
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
      // for inline attribute group definition, the owner information is lost here when a ref object created
      // updating it here
      if (this.getExplicitReference() != null &&
          this.getExplicitReference().getObjectType() == CdmObjectType.AttributeGroupDef &&
          this.getExplicitReference().getOwner() == null) {
        this.getExplicitReference().setOwner(this.getOwner());
      }

      return new CdmAttributeGroupReference(this.getCtx(), refTo, simpleReference);
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
    return CdmObjectBase.copyData(this, resOpt, options, CdmAttributeGroupReference.class);
  }

  
  /** 
   * @param resOpt Resolved options
   * @return ResolvedEntityReferenceSet
   */
  public ResolvedEntityReferenceSet fetchResolvedEntityReferences(ResolveOptions resOpt) {
    if (resOpt == null) {
      resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
    }

    final CdmObject ref = this.fetchResolvedReference(resOpt);
    if (ref != null) {
      return ((CdmAttributeGroupDefinition) ref).fetchResolvedEntityReferences(resOpt);
    }
    if (this.getExplicitReference() != null) {
      return ((CdmAttributeGroupDefinition) this.getExplicitReference()).fetchResolvedEntityReferences(resOpt);
    }
    return null;
  }

  /**
   *
   * @param pathRoot Path root
   * @param preChildren Pre Children
   * @param postChildren Post Children
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
   * @return CdmCollection of CdmAttributeItem
   */
  public CdmCollection<CdmAttributeItem> getMembers() {
    if (this.members == null) {
      this.members = new CdmCollection<>(this.getCtx(), this, CdmObjectType.TypeAttributeDef);
    }
    return this.members;
  }
}
