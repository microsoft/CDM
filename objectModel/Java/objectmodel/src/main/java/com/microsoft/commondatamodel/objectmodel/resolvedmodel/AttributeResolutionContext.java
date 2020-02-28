// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.resolvedmodel;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeResolutionGuidance;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeResolutionApplier;
import com.microsoft.commondatamodel.objectmodel.utilities.PrimitiveAppliers;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class AttributeResolutionContext {

  private List<AttributeResolutionApplier> actionsModify;
  private List<AttributeResolutionApplier> actionsGroupAdd;
  private List<AttributeResolutionApplier> actionsRoundAdd;
  private List<AttributeResolutionApplier> actionsAttributeAdd;
  private List<AttributeResolutionApplier> actionsRemove;
  private ResolvedTraitSet traitsToApply;
  private AttributeResolutionApplierCapabilities applierCaps;
  private CdmAttributeResolutionGuidance resGuide;
  private ResolveOptions resOpt;

  public AttributeResolutionContext(final ResolveOptions resOpt, final CdmAttributeResolutionGuidance resGuide,
                                    final ResolvedTraitSet traits) {
    // collect a set of appliers for all traits
    this.traitsToApply = traits;
    this.resGuide = resGuide;
    this.resOpt = resOpt;

    this.actionsModify = new ArrayList<>();
    this.actionsGroupAdd = new ArrayList<>();
    this.actionsRoundAdd = new ArrayList<>();
    this.actionsAttributeAdd = new ArrayList<>();
    this.actionsRemove = new ArrayList<>();
    this.applierCaps = null;

    this.resOpt = resOpt.copy();

    if (resGuide != null) {
      if (resGuide.getRemoveAttribute() != null) {
        addApplier(PrimitiveAppliers.isRemoved);
      }
      if (resGuide.getImposedDirectives() != null) {
        addApplier(PrimitiveAppliers.doesImposeDirectives);
      }
      if (resGuide.getRemovedDirectives() != null) {
        addApplier(PrimitiveAppliers.doesRemoveDirectives);
      }
      if (resGuide.getAddSupportingAttribute() != null) {
        addApplier(PrimitiveAppliers.doesAddSupportingAttribute);
      }
      if (resGuide.getRenameFormat() != null) {
        addApplier(PrimitiveAppliers.doesDisambiguateNames);
      }
      if (resGuide.getCardinality() != null && resGuide.getCardinality().equals("many")) {
        addApplier(PrimitiveAppliers.doesExplainArray);
      }
      if (resGuide.getEntityByReference() != null) {
        addApplier(PrimitiveAppliers.doesReferenceEntityVia);
      }
      if (resGuide.getSelectsSubAttribute() != null && resGuide.getSelectsSubAttribute()
          .getSelects().equals("one")) {
        addApplier(PrimitiveAppliers.doesSelectAttributes);
      }

      final ApplierPriorityComparator comparator = new ApplierPriorityComparator();
      actionsModify.sort(comparator);
      actionsGroupAdd.sort(comparator);
      actionsRoundAdd.sort(comparator);
      actionsAttributeAdd.sort(comparator);
    }
  }

  private boolean addApplier(final AttributeResolutionApplier apl) {
    if (applierCaps == null) {
      applierCaps = new AttributeResolutionApplierCapabilities();
    }

    // Collect the code that will perform the right action.
    // Associate with the resolved trait and get the priority
    if (apl.willAttributeModify != null && apl.doAttributeModify != null) {
      actionsModify.add(apl);
      applierCaps.canAttributeModify = true;
    }

    if (apl.willAttributeAdd != null && apl.doAttributeAdd != null) {
      actionsAttributeAdd.add(apl);
      applierCaps.canAttributeAdd = true;
    }

    if (apl.willGroupAdd != null && apl.doGroupAdd != null) {
      actionsGroupAdd.add(apl);
      applierCaps.canGroupAdd = true;
    }

    if (apl.willRoundAdd != null && apl.doRoundAdd != null) {
      actionsRoundAdd.add(apl);
      applierCaps.canRoundAdd = true;
    }

    if (apl.willAlterDirectives != null && apl.doAlterDirectives != null) {
      applierCaps.canAlterDirectives = true;
      apl.doAlterDirectives.accept(resOpt, resGuide);
    }

    if (apl.willCreateContext != null && apl.doCreateContext != null) {
      applierCaps.canCreateContext = true;
    }

    if (apl.willRemove != null) {
      actionsRemove.add(apl);
      applierCaps.canRemove = true;
    }

    return true;
  }

  public List<AttributeResolutionApplier> getActionsModify() {
    return actionsModify;
  }

  public void setActionsModify(final List<AttributeResolutionApplier> actionsModify) {
    this.actionsModify = actionsModify;
  }

  public List<AttributeResolutionApplier> getActionsGroupAdd() {
    return actionsGroupAdd;
  }

  public void setActionsGroupAdd(final List<AttributeResolutionApplier> actionsGroupAdd) {
    this.actionsGroupAdd = actionsGroupAdd;
  }

  public List<AttributeResolutionApplier> getActionsRoundAdd() {
    return actionsRoundAdd;
  }

  public void setActionsRoundAdd(final List<AttributeResolutionApplier> actionsRoundAdd) {
    this.actionsRoundAdd = actionsRoundAdd;
  }

  public List<AttributeResolutionApplier> getActionsAttributeAdd() {
    return actionsAttributeAdd;
  }

  public void setActionsAttributeAdd(final List<AttributeResolutionApplier> actionsAttributeAdd) {
    this.actionsAttributeAdd = actionsAttributeAdd;
  }

  public List<AttributeResolutionApplier> getActionsRemove() {
    return actionsRemove;
  }

  public void setActionsRemove(final List<AttributeResolutionApplier> actionsRemove) {
    this.actionsRemove = actionsRemove;
  }

  ResolvedTraitSet getTraitsToApply() {
    return traitsToApply;
  }

  public AttributeResolutionApplierCapabilities getApplierCaps() {
    return applierCaps;
  }

  public void setApplierCaps(final AttributeResolutionApplierCapabilities applierCaps) {
    this.applierCaps = applierCaps;
  }

  public CdmAttributeResolutionGuidance getResGuide() {
    return resGuide;
  }

  public void setResGuide(final CdmAttributeResolutionGuidance resGuide) {
    this.resGuide = resGuide;
  }

  public ResolveOptions getResOpt() {
    return resOpt;
  }

  public void setResOpt(final ResolveOptions resOpt) {
    this.resOpt = resOpt;
  }

  public class ApplierPriorityComparator implements Comparator<AttributeResolutionApplier> {

    public int compare(final AttributeResolutionApplier l, final AttributeResolutionApplier r) {
      return l.priority - r.priority;
    }
  }
}
