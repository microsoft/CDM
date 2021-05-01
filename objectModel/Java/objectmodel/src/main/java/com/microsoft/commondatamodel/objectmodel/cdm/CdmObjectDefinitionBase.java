// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

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
  public CdmObjectReference createSimpleReference(ResolveOptions resOpt) {
    if (resOpt == null) {
      resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
    }

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
      cdmObjectRef.setInDocument(this.getInDocument());
    }

    return cdmObjectRef;
  }

  @Override
  public <T extends CdmObjectDefinition> T fetchObjectDefinition(ResolveOptions resOpt) {
    if (resOpt == null) {
      resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
    }
    return (T) this;
  }

  @Override
  public String fetchObjectDefinitionName() {
    return this.getName();
  }

  /**
   *
   * @param resOpt Resolve Options
   * @param copy Copy object definition
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public void copyDef(final ResolveOptions resOpt, final CdmObjectDefinitionBase copy) {
    copy.setDeclaredPath(this.getDeclaredPath());
    copy.setExplanation(this.getExplanation());
    copy.getExhibitsTraits().clear();

    for (final CdmTraitReferenceBase trait : this.getExhibitsTraits()) {
      copy.getExhibitsTraits().add(trait);
    }
    copy.setInDocument(this.getInDocument()); // if gets put into a new document, this will change. until, use the source
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
      return def.isDerivedFrom(seek, resOpt);
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
      for (final CdmTraitReferenceBase exhibitsTrait : this.getExhibitsTraits()) {
        rtsb.mergeTraits(exhibitsTrait.fetchResolvedTraits(resOpt));
      }
    }
  }

  boolean visitDef(final String pathFrom, final VisitCallback preChildren, final VisitCallback postChildren) {
    return getExhibitsTraits() != null
            && exhibitsTraits.visitList(pathFrom + "/exhibitsTraits/", preChildren, postChildren);
  }

  // Creates a 'portable' reference object to this object. portable means there is no symbolic name set until this reference is placed into some final document.
  @Override
  @Deprecated
  public CdmObjectReference createPortableReference(ResolveOptions resOpt) {
    CdmObjectReferenceBase cdmObjectRef = ((CdmObjectReferenceBase)this.getCtx().getCorpus().makeObject(CdmCorpusDefinition.mapReferenceType(this.getObjectType()), "portable", true));
    cdmObjectRef.portableReference = this;
    cdmObjectRef.setInDocument(this.getInDocument()); // where it started life
    cdmObjectRef.setOwner(this.getOwner());

    return cdmObjectRef;
  }

}
