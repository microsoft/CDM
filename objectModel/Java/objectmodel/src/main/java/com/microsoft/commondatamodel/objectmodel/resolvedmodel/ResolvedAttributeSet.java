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
import com.microsoft.commondatamodel.objectmodel.utilities.ApplierState;
import com.microsoft.commondatamodel.objectmodel.utilities.PrimitiveAppliers;
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
  // this maps the the name of an owner (an entity attribute) to a set of the attributes names that were added because of that entAtt
  // used in the entity attribute code to decide when previous (inherit) attributes from an entAtt with the same name might need to be removed
  private Map<String, Set<String>> attributeOwnershipMap;
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
   * @param toMerge ResolvedAttribute
   * @return ResolvedAttributeSet
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public ResolvedAttributeSet merge(final ResolvedAttribute toMerge) {
    ResolvedAttributeSet rasResult = this;

    if (toMerge != null) {
      // if there is already a resolve attribute present, remove it before adding the new attribute
      if (rasResult.getResolvedName2resolvedAttribute().containsKey(toMerge.getResolvedName())) {
        ResolvedAttribute existing = rasResult.getResolvedName2resolvedAttribute()
                .get(toMerge.getResolvedName());
        if (existing != toMerge) {
          if (refCnt > 1 && existing.getTarget() != toMerge.getTarget()) {
            rasResult = rasResult.copy(); // copy on write
            existing = rasResult.getResolvedName2resolvedAttribute().get(toMerge.getResolvedName());
          } else {
            rasResult = this;
          }

          if (existing.getTarget() instanceof CdmAttribute) {
            rasResult.resolvedAttributeCount -= ((CdmAttribute) existing.getTarget()).getAttributeCount();
          } else if (existing.getTarget() instanceof ResolvedAttributeSet) {
            rasResult.resolvedAttributeCount -= ((ResolvedAttributeSet) existing.getTarget()).resolvedAttributeCount;
          }
          if (toMerge.getTarget() instanceof CdmAttribute) {
            rasResult.resolvedAttributeCount += ((CdmAttribute) toMerge.getTarget()).getAttributeCount();
          } else if (toMerge.getTarget() instanceof ResolvedAttributeSet) {
            rasResult.resolvedAttributeCount += ((ResolvedAttributeSet) toMerge.getTarget()).resolvedAttributeCount;
          }

          existing.setTarget(toMerge.getTarget()); // replace with newest version
          existing.setArc(toMerge.getArc());
          // merge a new ra into one with the same name, so make a lineage
          // the existing attCtx becomes the new lineage. but the old one needs to stay too... so you get both. it came from both places.
          // we need ONE place where this RA can point, so that will be the most recent place with a fixed lineage
          // A->C1->C0 gets merged with A'->C2->C3 that turns into A->C2->[(c3), (C1->C0)]. in the more simple case this is just A->C2->C1
          if (toMerge.getAttCtx() != null) {
            if (existing.getAttCtx() != null) {
              toMerge.getAttCtx().addLineage(existing.getAttCtx());
            }
            existing.setAttCtx(toMerge.getAttCtx());
          }
          final ResolvedTraitSet rtsMerge = existing.getResolvedTraits()
                  .mergeSet(toMerge.getResolvedTraits()); // newest one may replace

          if (rtsMerge != existing.getResolvedTraits()) {
            rasResult = rasResult.copy(); // copy on write
            existing = rasResult.getResolvedName2resolvedAttribute().get(toMerge.getResolvedName());
            existing.setResolvedTraits(rtsMerge);
          }
        }
      } else {
        if (refCnt > 1) {
          rasResult = rasResult.copy(); // copy on write
        }
        if (rasResult == null) {
          rasResult = this;
        }
        rasResult.getResolvedName2resolvedAttribute().put(toMerge.getResolvedName(), toMerge);
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
      }
      // merge the ownership map.
      if (toMerge.getAttributeOwnershipMap() != null)
      {
        if (this.getAttributeOwnershipMap() == null)
        {
          this.setAttributeOwnershipMap(new LinkedHashMap<>());
        }

        for (final Map.Entry<String, Set<String>> entry : toMerge.getAttributeOwnershipMap().entrySet()) {
          // always take the new one as the right list, not sure if the constructor for dictionary uses this logic or fails
          this.getAttributeOwnershipMap().put(entry.getKey(), entry.getValue());
        }
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
      CdmAttributeContext attCtxToMerge = resAtt.getAttCtx(); // start with the current context for the resolved att, if a copy happens this will change
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
        final ResolvedTraitSet rtsMerge = resAtt.getResolvedTraits().mergeSet(traits);
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
                attCtxToMerge.addLineage(resAtt.getAttCtx());
                resAtt.setAttCtx(attCtxToMerge);
              }

              ctx.resAttSource = resAtt;

              // Modify it.
              traitAction.doAttributeModify.accept(ctx);
            }
          }
        }
      }
      appliedAttSet.merge(resAtt);
    }

    appliedAttSet.setAttributeContext(this.attributeContext);

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
      copy.merge(copyRa);
    }

    // copy the ownership map. new map will point at old att lists, but we never update these lists, only make new ones, so all is well
    if (this.getAttributeOwnershipMap() != null) {
      copy.setAttributeOwnershipMap(new LinkedHashMap<>(this.getAttributeOwnershipMap()));
    }

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
        final Set<String> traitNames = resAtt.getResolvedTraits().collectTraitNames();
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
            final ResolvedTrait traitObj = ra.getResolvedTraits().find(resOpt, q.getTraitBaseName());
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
   * Everything in this set now 'belongs' to the specified owner
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * @param ownerName String
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public void setAttributeOwnership(String ownerName) {
    if (this.getSet() != null && this.getSet().size() > 0)
    {
      this.setAttributeOwnershipMap(new LinkedHashMap<>());
      final Set<String> nameSet = new LinkedHashSet<>(this.getResolvedName2resolvedAttribute().keySet()); // this map should always be up to date, so fair to use as a source of all names
      this.getAttributeOwnershipMap().put(ownerName, nameSet);
    }
  }

  /**
   * @param ownerName String
   * @param rasNewOnes ResolvedAttributeSet
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public void markOrphansForRemoval(String ownerName, ResolvedAttributeSet rasNewOnes) {
    if (this.getAttributeOwnershipMap() == null) {
      return;
    }
    if (!this.getAttributeOwnershipMap().containsKey(ownerName)) {
      return;
    }

    final Set<String> lastSet = this.getAttributeOwnershipMap().get(ownerName);

    // make a list of all atts from last time with this owner, remove the ones that show up now
    final Set<String> thoseNotRepeated = new LinkedHashSet<>(lastSet);
    // of course, if none show up, all must go
    if (rasNewOnes != null && rasNewOnes.getSet() != null && rasNewOnes.getSet().size() > 0) {

      for (final ResolvedAttribute newOne : rasNewOnes.getSet()) {
        if (lastSet.contains(newOne.getResolvedName())) {
          // congrats, you are not doomed
          thoseNotRepeated.remove(newOne.getResolvedName());
        }
      }
    }
    // anyone left must be marked for remove
    final Set<AttributeResolutionContext> fixedArcs = new LinkedHashSet<>(); // to avoid checking if we need to fix the same thing many times
    for (final String toRemove : thoseNotRepeated) {
      final ResolvedAttribute raDoomed = this.getResolvedName2resolvedAttribute().get(toRemove);

      if (raDoomed.getArc() != null) {
        // to remove these, need to have our special remover thing in the set of actions
        if (!fixedArcs.contains(raDoomed.getArc())) {
          fixedArcs.add(raDoomed.getArc()); // not again
          if (raDoomed.getArc().getApplierCaps().canRemove) {
            // don't add more than once.
            if (!raDoomed.getArc().getActionsRemove().contains(PrimitiveAppliers.isRemovedInternal)) {
              raDoomed.getArc().getActionsRemove().add(PrimitiveAppliers.isRemovedInternal);
            }
          } else {
            raDoomed.getArc().getActionsRemove().add(PrimitiveAppliers.isRemovedInternal);
            raDoomed.getArc().getApplierCaps().canRemove = true;
          }
        }
        // mark the att in the state
        if (raDoomed.getApplierState() == null) {
          raDoomed.setApplierState(new ApplierState());
        }
        raDoomed.getApplierState().setFlexRemove(true);
      }
    }
  }
  /**
   *
   * @return Map of the name of an owner (an entity attribute) to a set of the attributes names that were added
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public Map<String, Set<String>> getAttributeOwnershipMap() {
    return attributeOwnershipMap;
  }

  /**
   *
   * @param attributeOwnershipMap Map of the name of an owner (an entity attribute) to a set of the attributes names that were added
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public void setAttributeOwnershipMap(final Map<String, Set<String>> attributeOwnershipMap) {
    this.attributeOwnershipMap = attributeOwnershipMap;
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
