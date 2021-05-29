// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.stream.Collectors;

import com.microsoft.commondatamodel.objectmodel.enums.CdmAttributeContextType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttributeSet;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttributeSetBuilder;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedEntityReferenceSet;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTraitSet;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTraitSetBuilder;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeContextParameters;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

public class CdmAttributeGroupDefinition extends CdmObjectDefinitionBase implements CdmReferencesEntities {

  private static final String TAG = CdmAttributeGroupDefinition.class.getSimpleName();
  
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

  
  /** 
   * @return String
   */
  @Override
  public String getName() {
    return this.attributeGroupName;
  }

  
  /** 
   * @param baseDef base def string
   * @param resOpt Resolved options
   * @return boolean
   */
  @Override
  public boolean isDerivedFrom(final String baseDef, ResolveOptions resOpt) {
    return false;
  }

  
  /** 
   * @param pathFrom Path from
   * @param preChildren Pre children
   * @param postChildren post children
   * @return boolean
   */
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
    if (this.attributeContext != null) {
      this.attributeContext.setOwner(this);
      if (this.attributeContext
          .visit(path + "/attributeContext/", preChildren, postChildren)) {
        return true;
      }
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
   * @return Cdm Attribute Context Reference
   */
  public CdmAttributeContextReference getAttributeContext() {
    return this.attributeContext;
  }

  
  /** 
   * @param value CdmAttributeContextReference
   */
  public void setAttributeContext(final CdmAttributeContextReference value) {
    this.attributeContext = value;
  }

  /**
   * Gets or sets the attribute group name.
   * @return String
   */
  public String getAttributeGroupName() {
    return this.attributeGroupName;
  }

  
  /** 
   * @param value string value
   */
  public void setAttributeGroupName(final String value) {
    this.attributeGroupName = value;
  }

  /**
   * Gets the attribute group members.
   * @return CdmCollection
   */
  public CdmCollection<CdmAttributeItem> getMembers() {
    return this.members;
  }

  
  /**
   * @deprecated for internal use only.
   * @param resOpt Resolved options
   * @return ResolvedEntityReferenceSet
   */
  @Override
  public ResolvedEntityReferenceSet fetchResolvedEntityReferences(ResolveOptions resOpt) {
    if (resOpt == null) {
      resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
    }

    final ResolvedEntityReferenceSet rers = new ResolvedEntityReferenceSet(resOpt);
    if (this.members != null) {
      for (int i = 0; i < this.members.getCount(); i++) {
        rers.add(this.members.getAllItems().get(i).fetchResolvedEntityReferences(resOpt));
      }
    }
    return rers;
  }

  
  /** 
   * @return boolean
   */
  @Override
  public boolean validate() {
    if (StringUtils.isNullOrTrimEmpty(this.attributeGroupName)) {
      ArrayList<String> missingFields = new ArrayList<String>(Arrays.asList("attributeGroupName"));
      Logger.error(this.getCtx(), TAG, "validate", this.getAtCorpusPath(), CdmLogCode.ErrValdnIntegrityCheckFailure, this.getAtCorpusPath(), String.join(", ", missingFields.parallelStream().map((s) -> { return String.format("'%s'", s);}).collect(Collectors.toList())));
      return false;
    }
    return true;
  }

  /**
   *
   * @param resOpt Resolved options
   * @param options Copy options
   * @return Object
   * @deprecated CopyData is deprecated. Please use the Persistence Layer instead. This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Override
  @Deprecated
  public Object copyData(final ResolveOptions resOpt, final CopyOptions options) {
    return CdmObjectBase.copyData(this, resOpt, options, CdmAttributeGroupDefinition.class);
  }

  
  /** 
   * @param resOpt Resolved options
   * @param host Host object
   * @return CdmObject
   */
  @Override
  public CdmObject copy(ResolveOptions resOpt, CdmObject host) {
    if (resOpt == null) {
      resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
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

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @param resOpt Resolved options
   * @return ResolvedAttributeSetBuilder
   */
  @Override
  @Deprecated
  public ResolvedAttributeSetBuilder constructResolvedAttributes(final ResolveOptions resOpt) {
    return constructResolvedAttributes(resOpt, null);
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   * @param resOpt Resolved options
   * @param under attribute context
   * @return ResolvedAttributeSetBuilder
   */
  @Override
  @Deprecated
  public ResolvedAttributeSetBuilder constructResolvedAttributes(final ResolveOptions resOpt, CdmAttributeContext under) {
    final ResolvedAttributeSetBuilder rasb = new ResolvedAttributeSetBuilder();
    final CdmAttributeContext allUnder = under;
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
        final CdmObject att = this.members.get(i);
        AttributeContextParameters acpAtt = null;
        if (under != null) {
          acpAtt = new AttributeContextParameters();
          acpAtt.setUnder(under);
          acpAtt.setType(CdmAttributeContextType.AttributeDefinition);
          acpAtt.setName(att.fetchObjectDefinitionName());
          acpAtt.setRegarding(att);
          acpAtt.setIncludeTraits(false);
        }
        ResolvedAttributeSet rasFromAtt = att.fetchResolvedAttributes(resOpt, acpAtt);
        // before we just merge, need to handle the case of 'attribute restatement' AKA an entity with an attribute having the same name as an attribute
        // from a base entity. thing might come out with different names, if they do, then any attributes owned by a similar named attribute before
        // that didn't just pop out of that same named attribute now need to go away.
        // mark any attributes formerly from this named attribute that don't show again as orphans
        rasb.getResolvedAttributeSet().markOrphansForRemoval(att.fetchObjectDefinitionName(), rasFromAtt);
        // now merge
        rasb.mergeAttributes(rasFromAtt);
      }
    }
    rasb.getResolvedAttributeSet().setAttributeContext(allUnder);  // context must be the one expected from the caller's pov.

    // things that need to go away
    rasb.removeRequestedAtts();
    return rasb;
  }

  
  /** 
   * @param rtsb Resolved set builder
   * @param resOpt - Resolved options
   */
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

  
  /** 
   * @param attributeDef Attribute definition
   * @return CdmAttributeItem
   */
  CdmAttributeItem addAttributeDef(CdmAttributeItem attributeDef) {
      this.getMembers().add(attributeDef);
      return attributeDef;
  }
}
