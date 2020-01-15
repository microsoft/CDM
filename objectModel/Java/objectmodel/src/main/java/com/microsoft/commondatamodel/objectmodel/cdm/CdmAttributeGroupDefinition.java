// Copyright (c) Microsoft Corporation.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.google.common.base.Strings;
import com.microsoft.commondatamodel.objectmodel.enums.CdmAttributeContextType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttributeSetBuilder;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedEntityReferenceSet;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTraitSet;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTraitSetBuilder;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeContextParameters;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;

public class CdmAttributeGroupDefinition extends CdmObjectDefinitionBase implements CdmReferencesEntities {

  private CdmAttributeContextReference attributeContext;
  private String attributeGroupName;
  private CdmCollection<CdmAttributeItem> members;

  public CdmAttributeGroupDefinition(final CdmCorpusContext ctx, final String attributeGroupName) {
    super(ctx);
    this.setObjectType(CdmObjectType.AttributeGroupDef);
    this.attributeGroupName = attributeGroupName;
    this.members = new CdmCollection<>(
        this.getCtx(),
        this,
        CdmObjectType.TypeAttributeDef);
  }

  @Override
  public String getName() {
    return this.attributeGroupName;
  }

  @Override
  public boolean isDerivedFrom(final String baseDef, final ResolveOptions resOpt) {
    return false;
  }

  @Override
  public boolean visit(final String pathFrom, final VisitCallback preChildren, final VisitCallback postChildren) {
    String path = "";

    if (this.getCtx() != null
        && this.getCtx().getCorpus() != null
        && !this.getCtx().getCorpus().blockDeclaredPathChanges) {
      path = this.getDeclaredPath();

      if (StringUtils.isNullOrTrimEmpty(path)) {
        path = pathFrom + this.attributeGroupName;
        this.setDeclaredPath(path);
      }
    }

    if (preChildren != null && preChildren.invoke(this, path)) {
      return false;
    }
    if (this.attributeContext != null && this.attributeContext
        .visit(path + "/attributeContext/", preChildren, postChildren)) {
      return true;
    }
    if (this.getMembers() != null) {
      if (this.members.visitList(path + "/members/", preChildren, postChildren)) {
        return true;
      }
    }
    if (this.visitDef(path, preChildren, postChildren)) {
      return true;
    }

    if (postChildren != null && postChildren.invoke(this, path)) {
      return true;
    }
    return false;
  }

  /**
   * Gets or sets the attribute group context.
   */
  public CdmAttributeContextReference getAttributeContext() {
    return this.attributeContext;
  }

  public void setAttributeContext(final CdmAttributeContextReference value) {
    this.attributeContext = value;
  }

  /**
   * Gets or sets the attribute group name.
   */
  public String getAttributeGroupName() {
    return this.attributeGroupName;
  }

  public void setAttributeGroupName(final String value) {
    this.attributeGroupName = value;
  }

  /**
   * Gets the attribute group members.
   */
  public CdmCollection<CdmAttributeItem> getMembers() {
    return this.members;
  }

  @Override
  public ResolvedEntityReferenceSet fetchResolvedEntityReferences(final ResolveOptions resOpt) {
    final ResolvedEntityReferenceSet rers = new ResolvedEntityReferenceSet(resOpt);
    if (this.members != null) {
      for (int i = 0; i < this.members.getCount(); i++) {
        rers.add(this.members.getAllItems().get(i).fetchResolvedEntityReferences(resOpt));
      }
    }
    return rers;
  }

  @Override
  public boolean validate() {
    return !Strings.isNullOrEmpty(this.attributeGroupName);
  }

  /**
   *
   * @param resOpt
   * @param options
   * @return
   * @deprecated CopyData is deprecated. Please use the Persistence Layer instead. This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public Object copyData(final ResolveOptions resOpt, final CopyOptions options) {
    return CdmObjectBase.copyData(this, resOpt, options, CdmAttributeGroupDefinition.class);
  }

  @Override
  public CdmObject copy(ResolveOptions resOpt, CdmObject host) {
    if (resOpt == null) {
      resOpt = new ResolveOptions(this);
    }

    CdmAttributeGroupDefinition copy;
    if (host == null) {
      copy = new CdmAttributeGroupDefinition(this.getCtx(), this.getAttributeGroupName());
    } else {
      copy = (CdmAttributeGroupDefinition) host;
      copy.setCtx(this.getCtx());
      copy.setAttributeGroupName(this.getAttributeGroupName());
      copy.getMembers().clear();
    }


    if (this.getAttributeContext() != null) {
      copy.setAttributeContext((CdmAttributeContextReference) this.getAttributeContext().copy(resOpt));
    }
    for (final CdmAttributeItem newMember : this.getMembers()) {
      copy.getMembers().add(newMember);
    }
    this.copyDef(resOpt, copy);
    return copy;
  }

  @Override
  ResolvedAttributeSetBuilder constructResolvedAttributes(final ResolveOptions resOpt) {
    return constructResolvedAttributes(resOpt, null);
  }

  @Override
  ResolvedAttributeSetBuilder constructResolvedAttributes(final ResolveOptions resOpt, CdmAttributeContext under) {
    final ResolvedAttributeSetBuilder rasb = new ResolvedAttributeSetBuilder();
    if (under != null) {
      final AttributeContextParameters acpAttGrp = new AttributeContextParameters();
      acpAttGrp.setUnder(under);
      acpAttGrp.setType(CdmAttributeContextType.AttributeGroup);
      acpAttGrp.setName(this.getName());
      acpAttGrp.setRegarding(this);
      acpAttGrp.setIncludeTraits(false);

      under = rasb.getResolvedAttributeSet().createAttributeContext(resOpt, acpAttGrp);
    }

    if (this.getMembers() != null) {
      for (int i = 0; i < this.getMembers().getCount(); i++) {
        final CdmObject att = this.members.getAllItems().get(i);
        AttributeContextParameters acpAtt = null;
        if (under != null) {
          acpAtt = new AttributeContextParameters();
          acpAtt.setUnder(under);
          acpAtt.setType(CdmAttributeContextType.AttributeDefinition);
          acpAtt.setName(att.fetchObjectDefinitionName());
          acpAtt.setRegarding(att);
          acpAtt.setIncludeTraits(false);
        }
        rasb.mergeAttributes(att.fetchResolvedAttributes(resOpt, acpAtt));
      }
    }
    rasb.getResolvedAttributeSet().setAttributeContext(under);

    // things that need to go away
    rasb.removeRequestedAtts();
    return rasb;
  }

  @Override
  void constructResolvedTraits(final ResolvedTraitSetBuilder rtsb, final ResolveOptions resOpt) {
    // get only the elevated traits from attribute first, then add in all traits from this definition
    if (this.getMembers() != null) {
      ResolvedTraitSet rtsElevated = new ResolvedTraitSet(resOpt);
      for (int i = 0; i < this.getMembers().getCount(); i++) {
        final Object att = this.members.getAllItems().get(i);
        final ResolvedTraitSet rtsAtt = ((CdmObject) att).fetchResolvedTraits(resOpt);
        if (rtsAtt != null && rtsAtt.getHasElevated() != null && rtsAtt.getHasElevated()) {
          rtsElevated = rtsElevated.mergeSet(rtsAtt, true);
        }
      }
      rtsb.mergeTraits(rtsElevated);
    }
    this.constructResolvedTraitsDef(null, rtsb, resOpt);
  }
}
