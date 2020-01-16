package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTraitSet;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTraitSetBuilder;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;

public abstract class CdmAttribute extends CdmObjectDefinitionBase implements CdmAttributeItem {

  private String name;
  private String explanation;
  private CdmPurposeReference purpose;
  private CdmAttributeResolutionGuidance resolutionGuidance;
  private CdmTraitCollection appliedTraits;

  public CdmAttribute(final CdmCorpusContext ctx, final String name) {
    super(ctx);
    this.name = name;
    this.appliedTraits = new CdmTraitCollection(this.getCtx(), this);
  }

  CdmAttribute copyAtt(final ResolveOptions resOpt, final CdmAttribute copy) {
    copy.setPurpose(
        this.getPurpose() != null ? (CdmPurposeReference) this.getPurpose().copy(resOpt) : null);
    copy.setResolutionGuidance(
        this.getResolutionGuidance() != null ? (CdmAttributeResolutionGuidance) this
            .getResolutionGuidance().copy(resOpt) : null);

    copy.getAppliedTraits().clear();
    for (final CdmTraitReference appliedTrait : this.getAppliedTraits()) {
      copy.getAppliedTraits().add(appliedTrait);
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

  boolean visitAtt(final String pathFrom, final VisitCallback preChildren, final VisitCallback postChildren) {
    if (this.getPurpose() != null && this.getPurpose()
        .visit(pathFrom + "/purpose/", preChildren, postChildren)) {
      return true;
    }
    if (this.getAppliedTraits() != null && this.getAppliedTraits()
        .visitList(pathFrom + "/appliedTraits/", preChildren, postChildren)) {
      return true;
    }
    if (this.getResolutionGuidance() != null && this.getResolutionGuidance()
        .visit(pathFrom + "/resolutionGuidance/", preChildren, postChildren)) {
      return true;
    }

    return this.visitDef(pathFrom, preChildren, postChildren);
  }

  ResolvedTraitSet addResolvedTraitsApplied(
      final ResolvedTraitSetBuilder rtsb,
      final ResolveOptions resOpt) {
    this.getAppliedTraits()
        .forEach(appliedTraits -> rtsb.mergeTraits(appliedTraits.fetchResolvedTraits(resOpt)));
    // dynamic applied on use
    return rtsb.getResolvedTraitSet();
  }
}
