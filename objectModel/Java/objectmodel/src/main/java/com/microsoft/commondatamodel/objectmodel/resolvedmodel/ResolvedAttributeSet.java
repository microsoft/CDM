// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.resolvedmodel;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttribute;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeResolutionGuidance;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObject;
import com.microsoft.commondatamodel.objectmodel.cdm.StringSpewCatcher;
import com.microsoft.commondatamodel.objectmodel.enums.CdmAttributeContextType;
import com.microsoft.commondatamodel.objectmodel.utilities.ApplierContext;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeContextParameters;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeResolutionApplier;
import com.microsoft.commondatamodel.objectmodel.utilities.RefCounted;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

/**
 * @deprecated This class is extremely likely to be removed in the public interface, and not meant
 * to be called externally at all. Please refrain from using it.
 */
@Deprecated
public class ResolvedAttributeSet extends RefCounted {

  private Map<String, ResolvedAttribute> resolvedName2resolvedAttribute;
  private Map<String, Set<ResolvedAttribute>> baseTrait2Attributes;
  private Map<ResolvedAttribute, Set<CdmAttributeContext>> ra2attCtxSet;
  private Map<CdmAttributeContext, ResolvedAttribute> attCtx2ra;
  private List<ResolvedAttribute> set;
  private CdmAttributeContext attributeContext;
  private int insertOrder;
  private int resolvedAttributeCount;
  // indicates the depth level that this set was resolved at.
  // resulting set can vary depending on the maxDepth value
  private int depthTraveled;

  public ResolvedAttributeSet() {
    super();

    resolvedName2resolvedAttribute = new LinkedHashMap<>();
    ra2attCtxSet = new LinkedHashMap<>();
    attCtx2ra = new LinkedHashMap<>();
    set = new ArrayList<>();
    resolvedAttributeCount = 0;
    depthTraveled = 0;
  }

  public CdmAttributeContext createAttributeContext(
      final ResolveOptions resOpt,
      final AttributeContextParameters acp) {
    if (acp == null) {
      return null;
    }

    // store the current context
    attributeContext = CdmAttributeContext.createChildUnder(resOpt, acp);
    return attributeContext;
  }

  /**
   *
   * @param attCtx CdmAttributeContext
   * @param ra ResolvedAttribute
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public void cacheAttributeContext(final CdmAttributeContext attCtx, final ResolvedAttribute ra) {
    if (attCtx != null && ra != null) {
      attCtx2ra.put(attCtx, ra);
      // set collection will take care of adding context to set
      if (!ra2attCtxSet.containsKey(ra)) {
        ra2attCtxSet.put(ra, new LinkedHashSet<>());
      }
      ra2attCtxSet.get(ra).add(attCtx);
    }
  }

  /**
   *
   * @param attCtx CdmAttributeContext
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public void removeCachedAttributeContext(final CdmAttributeContext attCtx) {
    if (attCtx != null) {
      final ResolvedAttribute oldRa = this.attCtx2ra.get(attCtx);
      if (oldRa != null && this.ra2attCtxSet.containsKey(oldRa)) {
        this.attCtx2ra.remove(attCtx);
        this.ra2attCtxSet.get(oldRa).remove(attCtx);
        if (this.ra2attCtxSet.get(oldRa).size() == 0) {
          this.ra2attCtxSet.remove(oldRa);
        }
      }
    }
  }

  /**
   *
   * @param toMerge ResolvedAttribute
   * @return ResolvedAttributeSet
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public ResolvedAttributeSet merge(final ResolvedAttribute toMerge) {
    return merge(toMerge, null);
  }

  /**
   *
   * @param toMerge ResolvedAttribute
   * @param attCtx CdmAttributeContext
   * @return ResolvedAttributeSet
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public ResolvedAttributeSet merge(
      final ResolvedAttribute toMerge,
      final CdmAttributeContext attCtx) {
    ResolvedAttributeSet rasResult = this;

    if (toMerge != null) {
      // if there is already a resolve attribute present, remove it before adding the new attribute
      if (rasResult.getResolvedName2resolvedAttribute().containsKey(toMerge.getResolvedName())) {
        ResolvedAttribute existing = rasResult.getResolvedName2resolvedAttribute()
            .get(toMerge.getResolvedName());

        if (refCnt > 1 && existing.getTarget() != toMerge.getTarget()) {
          rasResult = rasResult.copy(); // copy on write
          existing = rasResult.getResolvedName2resolvedAttribute().get(toMerge.getResolvedName());
        } else {
          rasResult = this;
        }

        if (existing.getTarget() instanceof CdmAttribute) {
          rasResult.resolvedAttributeCount -= ((CdmAttribute)existing.getTarget()).getAttributeCount();
        } else if (existing.getTarget() instanceof ResolvedAttributeSet) {
          rasResult.resolvedAttributeCount -= ((ResolvedAttributeSet)existing.getTarget()).resolvedAttributeCount;
        }

        if (toMerge.getTarget() instanceof CdmAttribute) {
          rasResult.resolvedAttributeCount += ((CdmAttribute)toMerge.getTarget()).getAttributeCount();
        } else if (toMerge.getTarget() instanceof ResolvedAttributeSet) {
          rasResult.resolvedAttributeCount += ((ResolvedAttributeSet)toMerge.getTarget()).resolvedAttributeCount;
        }

        existing.setTarget(toMerge.getTarget()); // replace with newest version
        existing.setArc(toMerge.getArc());

        // Replace old context mappings with mappings to new attribute
        rasResult.removeCachedAttributeContext(existing.getAttCtx());
        rasResult.cacheAttributeContext(attCtx, existing);

        final ResolvedTraitSet rtsMerge = existing.fetchResolvedTraits()
            .mergeSet(toMerge.fetchResolvedTraits()); // newest one may replace

        if (rtsMerge != existing.fetchResolvedTraits()) {
          rasResult = rasResult.copy(); // copy on write
          existing = rasResult.getResolvedName2resolvedAttribute().get(toMerge.getResolvedName());
          existing.setResolvedTraits(rtsMerge);
        }
      } else {
        if (refCnt > 1) {
          rasResult = rasResult.copy(); // copy on write
        }
        if (rasResult == null) {
          rasResult = this;
        }
        rasResult.getResolvedName2resolvedAttribute().put(toMerge.getResolvedName(), toMerge);
        // don't use the attCtx on the actual attribute, that's only for doing appliers
        if (attCtx != null) {
          rasResult.cacheAttributeContext(attCtx, toMerge);
        }
        //toMerge.InsertOrder = rasResult.Set.Count;
        rasResult.getSet().add(toMerge);
        rasResult.resolvedAttributeCount += toMerge.getResolvedAttributeCount();
      }

      baseTrait2Attributes = null;
    }

    return rasResult;
  }

  void alterSetOrderAndScope(final List<ResolvedAttribute> newSet) {
    // Assumption is that newSet contains only some or all attributes from the original value of Set.
    // If not, the stored attribute context mappings are busted.
    this.baseTrait2Attributes = null;
    this.resolvedName2resolvedAttribute = new LinkedHashMap<>(); // rebuild with smaller set
    this.set = newSet;

    for (ResolvedAttribute ra : newSet) {
      if (!resolvedName2resolvedAttribute.containsKey(ra.getResolvedName())) {
        resolvedName2resolvedAttribute.put(ra.getResolvedName(), ra);
      }
    }
  }

  private void copyAttCtxMappingsInto(
      final Map<ResolvedAttribute,
          Set<CdmAttributeContext>> ra2attCtxSet,
      final Map<CdmAttributeContext,
          ResolvedAttribute> attCtx2ra,
      final ResolvedAttribute sourceRa) {
    copyAttCtxMappingsInto(ra2attCtxSet, attCtx2ra, sourceRa, null);
  }

  private void copyAttCtxMappingsInto(
      final Map<ResolvedAttribute,
          Set<CdmAttributeContext>> ra2attCtxSet,
      final Map<CdmAttributeContext, ResolvedAttribute> attCtx2ra,
      final ResolvedAttribute sourceRa,
      ResolvedAttribute newRa) {
    if (this.ra2attCtxSet.size() > 0) {
      Set<CdmAttributeContext> attCtxSet = null;

      if (newRa == null) {
        newRa = sourceRa;
      }

      // get the set of attribute contexts for the old resolved attribute
      if (this.ra2attCtxSet.containsKey(sourceRa)) {
        attCtxSet = this.ra2attCtxSet.get(sourceRa);
      }

      if (attCtxSet != null) {
        // map the new resolved attribute to the old context set
        if (ra2attCtxSet.containsKey(newRa)) {
          final Set<CdmAttributeContext> currentSet = ra2attCtxSet.get(newRa);
          currentSet.addAll(attCtxSet);
        } else {
          ra2attCtxSet.put(newRa, attCtxSet);
        }
        // map the old contexts to the new resolved attribute
        if (attCtxSet.size() > 0) {
          for (final CdmAttributeContext attCtx : attCtxSet) {
            attCtx2ra.put(attCtx, newRa);
          }
        }
      }
    }
  }

  ResolvedAttributeSet mergeSet(final ResolvedAttributeSet toMerge) {
    ResolvedAttributeSet rasResult = this;

    if (toMerge != null) {
      for (final ResolvedAttribute ra : toMerge.getSet()) {
        // don't pass in the context here
        final ResolvedAttributeSet rasMerged = rasResult.merge(ra);

        if (rasMerged != rasResult) {
          rasResult = rasMerged;
        }

        // get the attribute from the merged set, attributes that were already present were merged, not replaced
        final ResolvedAttribute currentRa = rasResult.resolvedName2resolvedAttribute.get(ra.getResolvedName());
        // copy context here
        toMerge.copyAttCtxMappingsInto(rasResult.getRa2attCtxSet(), rasResult.getAttCtx2ra(), ra, currentRa);
      }
    }

    return rasResult;
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  //  traits that change attributes
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  ResolvedAttributeSet applyTraits(
      final ResolvedTraitSet traits,
      final ResolveOptions resOpt,
      final CdmAttributeResolutionGuidance resGuide,
      final List<AttributeResolutionApplier> actions) {
    ResolvedAttributeSet rasResult = this;
    final ResolvedAttributeSet rasApplied;

    if (refCnt > 1 && rasResult.copyNeeded(traits, resOpt, resGuide, actions)) {
      rasResult = rasResult.copy();
    }

    rasApplied = rasResult.apply(traits, resOpt, resGuide, actions);

    // now we are that
    rasResult.setResolvedName2resolvedAttribute(rasApplied.getResolvedName2resolvedAttribute());
    rasResult.setBaseTrait2Attributes(null);
    rasResult.setSet(rasApplied.getSet());
    rasResult.setRa2attCtxSet(rasApplied.getRa2attCtxSet());
    rasResult.setAttCtx2ra(rasApplied.getAttCtx2ra());

    return rasResult;
  }

  boolean copyNeeded(final ResolvedTraitSet traits, final ResolveOptions resOpt, final CdmAttributeResolutionGuidance resGuide,
                     final List<AttributeResolutionApplier> actions) {
    if (actions == null || actions.size() == 0) {
      return false;
    }

    // for every attribute in the set, detect if a merge of traits will alter the traits. if so, need to copy the attribute set to avoid overwrite
    for (final ResolvedAttribute resAtt : set) {
      for (final AttributeResolutionApplier currentTraitAction : actions) {
        final ApplierContext ctx = new ApplierContext();
        ctx.resOpt = resOpt;
        ctx.resAttSource = resAtt;
        ctx.resGuide = resGuide;

        if (currentTraitAction.willAttributeModify.apply(ctx)) {
          return true;
        }
      }
    }

    return false;
  }

  ResolvedAttributeSet apply(
      final ResolvedTraitSet traits,
      final ResolveOptions resOpt,
      final CdmAttributeResolutionGuidance resGuide,
      final List<AttributeResolutionApplier> actions) {
    if (traits == null && actions.size() == 0) {
      // nothing can change
      return this;
    }

    // for every attribute in the set run any attribute appliers
    final ResolvedAttributeSet appliedAttSet = new ResolvedAttributeSet();

    final int l = this.set.size();
    appliedAttSet.setAttributeContext(this.attributeContext);

    // check to see if we need to make a copy of the attributes
    // do this when building an attribute context and when we will modify the attributes (beyond traits)
    // see if any of the appliers want to modify
    boolean makingCopy = false;
    if (l > 0 && appliedAttSet.getAttributeContext() != null && actions != null && actions.size() > 0) {
      final ResolvedAttribute resAttTest = this.set.get(0);

      for (final AttributeResolutionApplier traitAction : actions) {
        final ApplierContext ctx = new ApplierContext();
        ctx.resOpt = resOpt;
        ctx.resAttSource = resAttTest;
        ctx.resGuide = resGuide;
        if (traitAction.willAttributeModify.apply(ctx)) {
          makingCopy = true;
          break;
        }
      }
    }

    if (makingCopy) {
      // fake up a generation round for these copies that are about to happen
      AttributeContextParameters acp = new AttributeContextParameters();
      acp.setUnder(appliedAttSet.getAttributeContext());
      acp.setType(CdmAttributeContextType.GeneratedSet);
      acp.setName("_generatedAttributeSet");

      appliedAttSet.setAttributeContext(CdmAttributeContext.createChildUnder(traits.getResOpt(), acp));

      acp = new AttributeContextParameters();
      acp.setUnder(appliedAttSet.getAttributeContext());
      acp.setType(CdmAttributeContextType.GeneratedRound);
      acp.setName("_generatedAttributeRound0");

      appliedAttSet.setAttributeContext(CdmAttributeContext.createChildUnder(traits.getResOpt(), acp));
    }

    for (ResolvedAttribute resAtt : this.set) {
      CdmAttributeContext attCtxToMerge = null;
      if (resAtt.getTarget() instanceof ResolvedAttributeSet) {
        if (makingCopy) {
          resAtt = resAtt.copy();
          // making a copy of a subset (att group) also bring along the context tree for that whole group
          attCtxToMerge = resAtt.getAttCtx();
        }

        // the set contains another set. process those
        resAtt.setTarget(
            ((ResolvedAttributeSet) resAtt.getTarget()).apply(traits, resOpt, resGuide, actions)
        );
      } else {
        final ResolvedTraitSet rtsMerge = resAtt.fetchResolvedTraits().mergeSet(traits);
        resAtt.setResolvedTraits(rtsMerge);
        if (actions != null) {
          for (final AttributeResolutionApplier traitAction : actions) {
            final ApplierContext ctx = new ApplierContext();
            ctx.resOpt = traits.getResOpt();
            ctx.resGuide = resGuide;
            ctx.resAttSource = resAtt;
            if (traitAction.willAttributeModify.apply(ctx)) {
              // Make a context for this new copy.
              if (makingCopy) {

                final AttributeContextParameters acp = new AttributeContextParameters();
                acp.setUnder(appliedAttSet.getAttributeContext());
                acp.setType(CdmAttributeContextType.AttributeDefinition);
                acp.setName(resAtt.getResolvedName());
                acp.setRegarding((CdmObject) resAtt.getTarget());

                ctx.attCtx = CdmAttributeContext.createChildUnder(traits.getResOpt(), acp);
                attCtxToMerge = ctx.attCtx;
              }

              // Make a copy of the resolved att.
              if (makingCopy) {
                resAtt = resAtt.copy();
              }

              ctx.resAttSource = resAtt;

              // Modify it.
              traitAction.doAttributeModify.accept(ctx);
            }
          }
        }
      }
      appliedAttSet.merge(resAtt, attCtxToMerge);
    }

    appliedAttSet.setAttributeContext(this.attributeContext);

    if (!makingCopy) {
      // didn't copy the attributes or make any new context, so just take the old ones
      appliedAttSet.setRa2attCtxSet(ra2attCtxSet);
      appliedAttSet.setAttCtx2ra(attCtx2ra);
    }

    return appliedAttSet;
  }

  ResolvedAttributeSet removeRequestedAtts(final Marker marker) {
    int countIndex = marker.countIndex;
    int markIndex = marker.markIndex;

    // for every attribute in the set run any attribute removers on the traits they have
    ResolvedAttributeSet appliedAttSet = new ResolvedAttributeSet();

    final int l = set.size();
    for (int iAtt = 0; iAtt < l; iAtt++) {
      ResolvedAttribute resAtt = set.get(iAtt);
      // possible for another set to be in this set
      final ResolvedAttributeSet subSet = resAtt.getTarget() instanceof ResolvedAttributeSet
          ? (ResolvedAttributeSet) resAtt.getTarget()
          : null;

      if (subSet != null && subSet.getSet() != null) {
        // well, that happened. so now we go around again on this same function and get rid of things from this group
        marker.countIndex = countIndex;
        marker.markIndex = markIndex;
        final ResolvedAttributeSet newSubSet = subSet.removeRequestedAtts(marker);
        countIndex = marker.countIndex;
        markIndex = marker.markIndex;
        // replace the set with the new one that came back
        resAtt.setTarget(newSubSet);
        // if everything went away, then remove this group
        if (newSubSet == null || newSubSet.getSet() == null || newSubSet.getSet().size() == 0) {
          resAtt = null;
        } else {
          // don't count this as an attribute (later)
          countIndex--;
        }
      } else {
        // this is a good time to make the resolved names final
        resAtt.setPreviousResolvedName(resAtt.getResolvedName());

        if (resAtt.getArc() != null && resAtt.getArc().getApplierCaps() != null && resAtt.getArc()
            .getApplierCaps().canRemove) {
          for (final AttributeResolutionApplier apl : resAtt.getArc().getActionsRemove()) {
            // this should look like the applier context when the att was created
            final ApplierContext ctx = new ApplierContext();
            ctx.resOpt = resAtt.getArc().getResOpt();
            ctx.resAttSource = resAtt;
            ctx.resGuide = resAtt.getArc().getResGuide();

            if (apl.willRemove.apply(ctx)) {
              resAtt = null;
              break;
            }
          }
        }
      }

      if (resAtt != null) {
        // attribute remains
        // are we building a new set?
        if (appliedAttSet != null) {
          copyAttCtxMappingsInto(appliedAttSet.getRa2attCtxSet(), appliedAttSet.getAttCtx2ra(),
              resAtt);
          appliedAttSet.merge(resAtt);
        }

        countIndex++;
      } else {
        // remove the att
        // if this is the first removed attribute, then make a copy of the set now
        // after this point, the rest of the loop logic keeps the copy going as needed
        if (appliedAttSet == null) {
          appliedAttSet = new ResolvedAttributeSet();

          for (int iCopy = 0; iCopy < iAtt; iCopy++) {
            copyAttCtxMappingsInto(appliedAttSet.getRa2attCtxSet(), appliedAttSet.getAttCtx2ra(),
                set.get(iCopy));
            appliedAttSet.merge(set.get(iCopy));
          }
        }
        // track deletes under the mark (move the mark up)
        if (countIndex < markIndex) {
          markIndex--;
        }
      }
    }

    marker.countIndex = countIndex;
    marker.markIndex = markIndex;

    // now we are that (or a copy)
    ResolvedAttributeSet rasResult = this;
    if (appliedAttSet.size() != rasResult.size()) {
      rasResult = appliedAttSet;
      rasResult.setBaseTrait2Attributes(null);
      rasResult.setAttributeContext(this.attributeContext);
    }

    return rasResult;
  }

  /**
   *
   * @param name String
   * @return ResolvedAttribute
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public ResolvedAttribute get(final String name) {
    if (resolvedName2resolvedAttribute.containsKey(name)) {
      return resolvedName2resolvedAttribute.get(name);
    }

    ResolvedAttribute raFound = null;

    if (set != null && set.size() > 0) {
      // deeper look. first see if there are any groups held in this group
      for (final ResolvedAttribute ra : set) {
        if (ra.getTarget() instanceof ResolvedAttributeSet) {
          final ResolvedAttributeSet ras = (ResolvedAttributeSet) ra.getTarget();

          if (ras != null && ras.getSet() != null) {
            raFound = ras.get(name);

            if (raFound != null) {
              return raFound;
            }
          }
        }
      }
      // nothing found that way, so now look through the attribute definitions for a match
      for (final ResolvedAttribute ra : set) {
        final CdmAttribute attLook = (CdmAttribute) ra.getTarget();

        if (attLook != null && attLook.getName().equals(name)) {
          return ra;
        }
      }
    }

    return null;
  }

  public int size() {
    return resolvedName2resolvedAttribute.size();
  }

  public ResolvedAttributeSet copy() {
    final ResolvedAttributeSet copy = new ResolvedAttributeSet();
    copy.setAttributeContext(attributeContext);

    // save the mappings to overwrite
    // maps from merge may not be correct
    final Map<ResolvedAttribute, Set<CdmAttributeContext>> newRa2attCtxSet = new LinkedHashMap<>();
    final Map<CdmAttributeContext, ResolvedAttribute> newAttCtx2ra = new LinkedHashMap<>();

    for (final ResolvedAttribute sourceRa : set) {
      final ResolvedAttribute copyRa = sourceRa.copy();

      copyAttCtxMappingsInto(newRa2attCtxSet, newAttCtx2ra, sourceRa, copyRa);
      copy.merge(copyRa);
    }

    // reset mappings to the correct one
    copy.setRa2attCtxSet(newRa2attCtxSet);
    copy.setAttCtx2ra(newAttCtx2ra);
    copy.setDepthTraveled(this.depthTraveled);

    return copy;
  }

  public void spew(final ResolveOptions resOpt, final StringSpewCatcher to, final String indent, final boolean nameSort)
      throws IOException {
    if (set.size() > 0) {
      final List<ResolvedAttribute> list = new ArrayList<>(set);

      if (nameSort) {
        list.sort(Comparator.comparing(l -> l.getResolvedName().toLowerCase()));
      }

      for (final ResolvedAttribute ra : list) {
        ra.spew(resOpt, to, indent, nameSort);
      }
    }
  }

  public ResolvedAttributeSet fetchAttributesWithTraits(final ResolveOptions resOpt, final Object queryFor)
      throws IOException {
    // put the input into a standard form
    final List<TraitParamSpec> query = new ArrayList<>();

    if (queryFor instanceof List) {

      for (final Object q : (List) queryFor) {
        if (q instanceof String) {
          final TraitParamSpec spec = new TraitParamSpec();
          spec.setTraitBaseName((String) q);
          spec.setParameters(new LinkedHashMap<>());
          query.add(spec);
        } else {
          query.add((TraitParamSpec) q);
        }
      }
    } else {
      if (queryFor instanceof String) {
        final TraitParamSpec spec = new TraitParamSpec();
        spec.setTraitBaseName((String) queryFor);
        spec.setParameters(new LinkedHashMap<>());
        query.add(spec);
      } else {
        query.add((TraitParamSpec) queryFor);
      }
    }

    // if the map isn't in place, make one now. assumption is that this is called as part of a usage pattern where it will get called again.
    if (baseTrait2Attributes == null) {
      baseTrait2Attributes = new LinkedHashMap<>();

      for (final ResolvedAttribute resAtt : set) {
        // create a map from the name of every trait found in this whole set of attributes to the attributes that have the trait (included base classes of traits)
        final Set<String> traitNames = resAtt.fetchResolvedTraits().collectTraitNames();
        for (final String tName : traitNames) {
          if (!baseTrait2Attributes.containsKey(tName)) {
            baseTrait2Attributes.put(tName, new LinkedHashSet<>());
          }
          baseTrait2Attributes.get(tName).add(resAtt);
        }
      }
    }

    // for every trait in the query, get the set of attributes.
    // intersect these sets to get the final answer
    Set<ResolvedAttribute> finalSet = null;

    for (final TraitParamSpec q : query) {
      if (baseTrait2Attributes.containsKey(q.getTraitBaseName())) {
        Set<ResolvedAttribute> subSet = baseTrait2Attributes.get(q.getTraitBaseName());

        if (q.getParameters() != null && q.getParameters().size() > 0) {
          // need to check param values, so copy the subset to something we can modify
          final Set<ResolvedAttribute> filteredSubSet = new LinkedHashSet<>();

          for (final ResolvedAttribute ra : subSet) {
            final ResolvedTrait traitObj = ra.fetchResolvedTraits().find(resOpt, q.getTraitBaseName());
            if (traitObj != null) {
              final ParameterValueSet pvals = traitObj.getParameterValues();

              // compare to all query params
              // int lParams = q.getParameters().size();
              int iParam = 0;

              for (final Map.Entry<String, String> param : q.getParameters().entrySet()) {
                final ParameterValue pv = pvals.fetchParameterValue(param.getKey());
                // TODO-BQ: We need to handle the JSON exception somehow (or propagate?)
                if (pv == null || !Objects.equals(pv.fetchValueString(resOpt), param.getValue())) {
                  break;
                }
                iParam++;
              }

              // stop early means no match
              if (iParam == q.getParameters().size()) {
                filteredSubSet.add(ra);
              }
            }
          }

          subSet = filteredSubSet;
        }

        if (subSet != null && subSet.size() > 0) {
          // got some. either use as starting point for answer or intersect this in
          if (finalSet == null) {
            finalSet = subSet;
          } else {
            final Set<ResolvedAttribute> intersection = new LinkedHashSet<>();
            // intersect the two
            for (final ResolvedAttribute ra : finalSet) {
              if (subSet.contains(ra)) {
                intersection.add(ra);
              }
            }

            finalSet = intersection;
          }
        }
      }
    }

    // collect the final set into a resolvedAttributeSet
    if (finalSet != null && finalSet.size() > 0) {
      final ResolvedAttributeSet rasResult = new ResolvedAttributeSet();

      for (final ResolvedAttribute ra : finalSet) {
        rasResult.merge(ra);
      }

      return rasResult;
    }

    return null;
  }

  @Deprecated
  public int getDepthTraveled() {
    return depthTraveled;
  }

  @Deprecated
  public void setDepthTraveled(int depth) {
    this.depthTraveled = depth;
  }

  /**
   *
   * @return Map of ResolvedAttribute and Set of CdmAttributeContext
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public Map<ResolvedAttribute, Set<CdmAttributeContext>> getRa2attCtxSet() {
    return ra2attCtxSet;
  }

  /**
   *
   * @param ra2attCtxSet Map of ResolvedAttribute and Set of CdmAttributeContext
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public void setRa2attCtxSet(final Map<ResolvedAttribute, Set<CdmAttributeContext>> ra2attCtxSet) {
    this.ra2attCtxSet = ra2attCtxSet;
  }

  /**
   *
   * @return Map of CdmAttributeContext and ResolvedAttribute
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public Map<CdmAttributeContext, ResolvedAttribute> getAttCtx2ra() {
    return attCtx2ra;
  }

  /**
   *
   * @param attCtx2ra Map of CdmAttributeContext and ResolvedAttribute
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public void setAttCtx2ra(final Map<CdmAttributeContext, ResolvedAttribute> attCtx2ra) {
    this.attCtx2ra = attCtx2ra;
  }

  /**
   *
   * @return List of ResolvedAttribute
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public List<ResolvedAttribute> getSet() {
    return set;
  }

  /**
   *
   * @param set List of ResolvedAttribute
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public void setSet(final List<ResolvedAttribute> set)
  {
    this.setResolvedAttributeCount(set.stream().mapToInt(ResolvedAttribute::getResolvedAttributeCount).sum());
    this.set = set;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @return int count
   */
  @Deprecated
  public int getResolvedAttributeCount() { return this.resolvedAttributeCount; }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @param resolvedAttributeCount count
   */
  @Deprecated
  public void setResolvedAttributeCount(final int resolvedAttributeCount) { this.resolvedAttributeCount = resolvedAttributeCount; }

  public CdmAttributeContext getAttributeContext() {
    return attributeContext;
  }

  public void setAttributeContext(final CdmAttributeContext attributeContext) {
    this.attributeContext = attributeContext;
  }

  public int getInsertOrder() {
    return insertOrder;
  }

  public void setInsertOrder(final int insertOrder) {
    this.insertOrder = insertOrder;
  }

  public Map<String, ResolvedAttribute> getResolvedName2resolvedAttribute() {
    return resolvedName2resolvedAttribute;
  }

  public void setResolvedName2resolvedAttribute(
      final Map<String, ResolvedAttribute> resolvedName2resolvedAttribute) {
    this.resolvedName2resolvedAttribute = resolvedName2resolvedAttribute;
  }

  public Map<String, Set<ResolvedAttribute>> getBaseTrait2Attributes() {
    return baseTrait2Attributes;
  }

  public void setBaseTrait2Attributes(final Map<String, Set<ResolvedAttribute>> baseTrait2Attributes) {
    this.baseTrait2Attributes = baseTrait2Attributes;
  }
}
