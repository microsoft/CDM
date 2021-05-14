// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.cdm.projections.CardinalitySettings;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTraitSet;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTraitSetBuilder;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;

public abstract class CdmAttribute extends CdmObjectDefinitionBase implements CdmAttributeItem {

  private String name;
  private CdmPurposeReference purpose;
  private CdmAttributeResolutionGuidance resolutionGuidance;
  private CdmTraitCollection appliedTraits;
  private int attributeCount;
  /**
   * Cardinality setting for projections
   */
  private CardinalitySettings cardinality;

  public CdmAttribute(final CdmCorpusContext ctx, final String name) {
    super(ctx);
    this.name = name;
    this.appliedTraits = new CdmTraitCollection(this.getCtx(), this);
    this.setAttributeCount(0);
  }

  CdmAttribute copyAtt(final ResolveOptions resOpt, final CdmAttribute copy) {
    copy.setPurpose(
            this.getPurpose() != null ?
                    (CdmPurposeReference) this.getPurpose().copy(resOpt) : null);
    copy.setResolutionGuidance(
        this.getResolutionGuidance() != null ?
                (CdmAttributeResolutionGuidance) this.getResolutionGuidance().copy(resOpt) : null);

    copy.getAppliedTraits().clear();

    for (final CdmTraitReferenceBase trait : this.getAppliedTraits()) {
      copy.getAppliedTraits().add(trait);
    }

    this.copyDef(resOpt, copy);

    return copy;
  }

  @Override
  public String getName() {
    return this.name;
  }

  public void setName(final String value) {
    this.name = value;
  }

  public CdmPurposeReference getPurpose() {
    return this.purpose;
  }

  public void setPurpose(final CdmPurposeReference value) {
    this.purpose = value;
  }

  public CdmAttributeResolutionGuidance getResolutionGuidance() {
    return this.resolutionGuidance;
  }

  public void setResolutionGuidance(final CdmAttributeResolutionGuidance value) {
    this.resolutionGuidance = value;
  }

  @Override
  public CdmTraitCollection getAppliedTraits() {
    return this.appliedTraits;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @return int Attribute count
   */
  public int getAttributeCount() {
    return attributeCount;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @param attributeCount Attribute count
   */
  public void setAttributeCount(final int attributeCount) { this.attributeCount = attributeCount; }

  public CardinalitySettings getCardinality() {
    return cardinality;
  }

  public void setCardinality(final CardinalitySettings cardinality) {
    this.cardinality = cardinality;
  }

  boolean visitAtt(final String pathFrom, final VisitCallback preChildren, final VisitCallback postChildren) {
    if (this.getPurpose() != null) {
      this.getPurpose().setOwner(this);
    }
    if (this.getPurpose() != null && this.getPurpose()
        .visit(pathFrom + "/purpose/", preChildren, postChildren)) {
      return true;
    }
    if (this.getAppliedTraits() != null && this.getAppliedTraits()
        .visitList(pathFrom + "/appliedTraits/", preChildren, postChildren)) {
      return true;
    }
    if (this.getResolutionGuidance() != null) {
      this.getResolutionGuidance().setOwner(this);
      if (this.getResolutionGuidance()
        .visit(pathFrom + "/resolutionGuidance/", preChildren, postChildren)) {
       return true;
      }
    }

    return this.visitDef(pathFrom, preChildren, postChildren);
  }

  ResolvedTraitSet addResolvedTraitsApplied(final ResolvedTraitSetBuilder rtsb, final ResolveOptions resOpt) {
    getAppliedTraits().forEach(item -> rtsb.mergeTraits(item.fetchResolvedTraits(resOpt)));
    // dynamic applied on use
    return rtsb.getResolvedTraitSet();
  }
}
