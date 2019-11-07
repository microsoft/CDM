package com.microsoft.commondatamodel.objectmodel.cdm;

import com.google.common.base.Strings;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTraitSetBuilder;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.VisitCallback;

public abstract class CdmObjectDefinitionBase extends CdmObjectBase implements CdmObjectDefinition {

  private String explanation;
  private CdmTraitCollection exhibitsTraits;

  public CdmObjectDefinitionBase(final CdmCorpusContext ctx) {
    super(ctx);
    this.exhibitsTraits = new CdmTraitCollection(this.getCtx(), this);
  }

  public abstract String getName();

  @Override
  public CdmTraitCollection getExhibitsTraits() {
    return this.exhibitsTraits;
  }

  @Override
  public String getExplanation() {
    return explanation;
  }

  @Override
  public void setExplanation(final String explanation) {
    this.explanation = explanation;
  }

  @Override
  public CdmObjectReference createSimpleReference(final ResolveOptions resOpt) {
    final String name;
    if (!Strings.isNullOrEmpty(this.getDeclaredPath())) {
      name = this.getDeclaredPath();
    } else {
      name = this.getName();
    }

    final CdmObjectReferenceBase cdmObjectRef = this.getCtx()
            .getCorpus()
            .makeObject(CdmCorpusDefinition.mapReferenceType(this.getObjectType()), name, true);
    if (resOpt.isSaveResolutionsOnCopy()) {
      cdmObjectRef.setExplicitReference(this);
      cdmObjectRef.setDocCreatedIn(this.getDocCreatedIn());
    }

    return cdmObjectRef;
  }

  @Override
  public <T extends CdmObjectDefinition> T fetchObjectDefinition(final ResolveOptions resOpt) {
    resOpt.setFromMoniker(null);
    return (T) this;
  }

  @Override
  public String fetchObjectDefinitionName() {
    return this.getName();
  }

  /**
   *
   * @param resOpt
   * @param copy
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public void copyDef(final ResolveOptions resOpt, final CdmObjectDefinitionBase copy) {
    copy.setDeclaredPath(this.getDeclaredPath());
    copy.setExplanation(this.getExplanation());

    for (final CdmTraitReference trait : this.getExhibitsTraits()) {
      copy.getExhibitsTraits().add(trait);
    }
  }

  boolean isDerivedFromDef(final ResolveOptions resOpt, final CdmObjectReference baseCdmObjectReference,
                           final String name, final String seek) {
    if (seek != null && seek.equals(name)) {
      return true;
    }

    CdmObjectDefinition def = null;
    if (baseCdmObjectReference != null) {
      def = baseCdmObjectReference.fetchObjectDefinition(resOpt);
    }
    if (def != null) {
      return def.isDerivedFrom(resOpt, seek);
    }
    return false;
  }

  void constructResolvedTraitsDef(
      final CdmObjectReference baseCdmObjectReference,
      final ResolvedTraitSetBuilder rtsb,
      final ResolveOptions resOpt) {
    // Get from base public class first, then see if some are applied to base public class on
    // ref then add dynamic traits exhibited by this def.
    if (null != baseCdmObjectReference) {
      // Merge in all from base class.
      rtsb.mergeTraits(baseCdmObjectReference.fetchResolvedTraits(resOpt));
    }

    // Merge in dynamic that are exhibited by this class.
    if (null != this.getExhibitsTraits()) {
      for (final CdmTraitReference exhibitsTrait : this.getExhibitsTraits()) {
        rtsb.mergeTraits(exhibitsTrait.fetchResolvedTraits(resOpt));
      }
    }
  }

  boolean visitDef(final String pathFrom, final VisitCallback preChildren, final VisitCallback postChildren) {
    return getExhibitsTraits() != null
            && exhibitsTraits.visitList(pathFrom + "/exhibitsTraits/", preChildren, postChildren);
  }
}
