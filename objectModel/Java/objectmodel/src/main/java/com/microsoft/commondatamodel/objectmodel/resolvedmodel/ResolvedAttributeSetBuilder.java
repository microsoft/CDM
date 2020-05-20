// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.resolvedmodel;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeContext;
import com.microsoft.commondatamodel.objectmodel.enums.CdmAttributeContextType;
import com.microsoft.commondatamodel.objectmodel.utilities.ApplierContext;
import com.microsoft.commondatamodel.objectmodel.utilities.ApplierState;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeContextParameters;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeResolutionApplier;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Consumer;
import java.util.function.Function;

/**
 * @deprecated This class is extremely likely to be removed in the public interface, and not meant
 * to be called externally at all. Please refrain from using it.
 */
@Deprecated
public class ResolvedAttributeSetBuilder {

  private ResolvedAttributeSet resolvedAttributeSet;
  private int inheritedMark;

  public ResolvedAttributeSetBuilder() {
    resolvedAttributeSet = new ResolvedAttributeSet();
  }

  /**
   *
   * @param rasNew
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public void mergeAttributes(final ResolvedAttributeSet rasNew) {
    if (rasNew != null) {
      takeReference(resolvedAttributeSet.mergeSet(rasNew));
    }
  }

  private void takeReference(final ResolvedAttributeSet rasNew) {
    if (resolvedAttributeSet != rasNew) {
      if (rasNew != null) {
        rasNew.addRef();
      }

      if (resolvedAttributeSet != null) {
        resolvedAttributeSet.release();
      }

      resolvedAttributeSet = rasNew;
    }
  }

  /**
   *
   * @param ra
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public void ownOne(final ResolvedAttribute ra) {
    // save the current context
    final CdmAttributeContext attCtx = resolvedAttributeSet.getAttributeContext();

    takeReference(new ResolvedAttributeSet());

    resolvedAttributeSet.merge(ra, ra.getAttCtx());
    // reapply the old attribute context
    resolvedAttributeSet.setAttributeContext(attCtx);
  }

  public void applyTraits(final AttributeResolutionContext arc) {
    if (resolvedAttributeSet != null && arc != null && arc.getTraitsToApply() != null) {
      takeReference(resolvedAttributeSet
              .applyTraits(arc.getTraitsToApply(), arc.getResOpt(), arc.getResGuide(), arc.getActionsModify()));
    }
  }

  public void generateApplierAttributes(final AttributeResolutionContext arc, final boolean applyTraitsToNew) {
    if (arc == null || arc.getApplierCaps() == null) {
      return;
    }

    if (resolvedAttributeSet == null) {
      takeReference(new ResolvedAttributeSet());
    }

    // make sure all of the 'source' attributes know about this context
    final List<ResolvedAttribute> set = resolvedAttributeSet.getSet();

    if (set != null) {
      for (final ResolvedAttribute ra : set) {
        ra.setArc(arc);
      }

      // the resolution guidance may be asking for a one time 'take' or avoid of attributes from the source
      // this also can re-order the attributes
      if (arc.getResGuide() != null
              && arc.getResGuide().getSelectsSubAttribute() != null
              && Objects.equals(arc.getResGuide().getSelectsSubAttribute().getSelects(), "some")
              && (arc.getResGuide().getSelectsSubAttribute().getSelectsSomeTakeNames() != null
              || arc.getResGuide().getSelectsSubAttribute().getSelectsSomeAvoidNames() != null)) {
        // we will make a new resolved attribute set from the 'take' list
        List<ResolvedAttribute> takeSet = new ArrayList<>();
        List<String> selectsSomeTakeNames = arc.getResGuide().getSelectsSubAttribute().getSelectsSomeTakeNames();
        List<String> selectsSomeAvoidNames = arc.getResGuide().getSelectsSubAttribute().getSelectsSomeAvoidNames();

        if (selectsSomeTakeNames != null && selectsSomeAvoidNames == null) {
          // make an index that goes from name to insertion order
          Map<String, Integer> inverted = new LinkedHashMap<>();
          for (int iOrder = 0; iOrder < set.size(); iOrder++) {
            inverted.put(set.get(iOrder).getResolvedName(), iOrder);
          }

          for (String selectsSomeTakeName : selectsSomeTakeNames) {
            // if in the original set of attributes, take it in the new order
            int iOriginalOrder = inverted.getOrDefault(selectsSomeTakeName, -1);
            if (iOriginalOrder != -1) {
              takeSet.add(set.get(iOriginalOrder));
            }
          }
        }
        if (selectsSomeAvoidNames != null) {
          // make a quick look up of avoid names
          Set<String> avoid = new HashSet<>(selectsSomeAvoidNames);

          for (ResolvedAttribute resolvedAttribute : set) {
            // only take the ones not in avoid the list given
            if (!avoid.contains(resolvedAttribute.getResolvedName())) {
              takeSet.add(resolvedAttribute);
            }
          }
        }

        // replace the guts of the resolvedAttributeSet with this
        this.getResolvedAttributeSet().alterSetOrderAndScope(takeSet);
      }
    }

    // get the new atts and then add them one at a time into this set
    final List<ResolvedAttribute> newAtts = getApplierGeneratedAttributes(arc, true, applyTraitsToNew);

    if (newAtts != null) {
      ResolvedAttributeSet ras = resolvedAttributeSet;

      for (final ResolvedAttribute ra : newAtts) {
        ras = ras.merge(ra, ra.getAttCtx());
      }

      takeReference(ras);
    }
  }

  public void removeRequestedAtts() {
    if (resolvedAttributeSet != null) {
      final Marker marker = new Marker();
      marker.countIndex = 0;
      marker.markIndex = inheritedMark;
      takeReference(resolvedAttributeSet.removeRequestedAtts(marker));
      inheritedMark = marker.markIndex;
    }
  }

  public void markInherited() {
    if (resolvedAttributeSet != null && resolvedAttributeSet.getSet() != null) {
      // TODO-BQ : First line doesn't seem needed
      inheritedMark = resolvedAttributeSet.getSet().size();
      inheritedMark = countSet(resolvedAttributeSet, 0);
    } else {
      inheritedMark = 0;
    }
  }

  private int countSet(final ResolvedAttributeSet rasSub, final int offset) {
    int last = offset;

    if (rasSub != null && rasSub.getSet() != null) {
      for (final ResolvedAttribute ra : rasSub.getSet()) {
        if (ra.getTarget() != null && ra.getTarget() instanceof ResolvedAttributeSet) {
          if (((ResolvedAttributeSet) ra.getTarget()).getSet() != null){
            last = countSet((ResolvedAttributeSet) ra.getTarget(), last);
          }
        } else {
          last++;
        }
      }
    }

    return last;
  }

  public void markOrder() {
    markSet(resolvedAttributeSet, inheritedMark, 0);
  }

  private int markSet(final ResolvedAttributeSet rasSub, final int inheritedMark, final int offset) {
    int last = offset;

    if (rasSub != null && rasSub.getSet() != null) {
      rasSub.setInsertOrder(last);

      for (final ResolvedAttribute ra : rasSub.getSet()) {
        if (ra.getTarget() != null && ra.getTarget() instanceof ResolvedAttributeSet) {
          if (((ResolvedAttributeSet) ra.getTarget()).getSet() != null){
            last = markSet((ResolvedAttributeSet) ra.getTarget(), inheritedMark, last);
          }
        } else {
          if (last >= inheritedMark) {
            ra.setInsertOrder(last);
          }
          last++;
        }
      }
    }

    return last;
  }

  private List<ResolvedAttribute> getApplierGeneratedAttributes(
      final AttributeResolutionContext arc,
      final boolean clearState,
      final boolean applyModifiers) {
    if (resolvedAttributeSet == null || resolvedAttributeSet.getSet() == null || arc == null) {
      return null;
    }

    final AttributeResolutionApplierCapabilities caps = arc.getApplierCaps();

    if (caps == null || (!caps.canAttributeAdd && !caps.canGroupAdd && !caps.canRoundAdd)) {
      return null;
    }

    final List<ResolvedAttribute> resAttOut = new ArrayList<>();

    // this function constructs a 'plan' for building up the resolved attributes that get generated from a set of traits being applied to
    // a set of attributes. it manifests the plan into an array of resolved attributes
    // there are a few levels of hierarchy to consider.
    // 1. once per set of attributes, the traits may want to generate attributes. this is an attribute that is somehow descriptive of the whole set,
    //    even if it has repeating patterns, like the count for an expanded array.
    // 2. it is possible that some traits (like the array expander) want to keep generating new attributes for some run. each time they do this is considered a 'round'
    //    the traits are given a chance to generate attributes once per round. every set gets at least one round, so these should be the attributes that
    //    describe the set of other attributes. for example, the foreign key of a relationship or the 'class' of a polymorphic type, etc.
    // 3. for each round, there are new attributes created based on the resolved attributes from the previous round (or the starting atts for this set)
    //    the previous round attribute need to be 'done' having traits applied before they are used as sources for the current round.
    // the goal here is to process each attribute completely before moving on to the next one

    // that may need to start out clean
    if (clearState) {
      for (final ResolvedAttribute item : resolvedAttributeSet.getSet()) {
        item.setApplierState(null);
      }
    }

    // make an attribute context to hold attributes that are generated from appliers
    // there is a context for the entire set and one for each 'round' of applications that happen
    CdmAttributeContext attCtxContainerGroup = this.getResolvedAttributeSet().getAttributeContext();
    if (attCtxContainerGroup != null) {
      final AttributeContextParameters acp = new AttributeContextParameters();
      acp.setUnder(attCtxContainerGroup);
      acp.setType(CdmAttributeContextType.GeneratedSet);
      acp.setName("_generatedAttributeSet");

      attCtxContainerGroup = CdmAttributeContext.createChildUnder(arc.getResOpt(), acp);
    }

    CdmAttributeContext attCtxContainer = attCtxContainerGroup;

    // get the one time atts
    if (caps.canGroupAdd && arc.getActionsGroupAdd() != null) {
      for (final AttributeResolutionApplier action : arc.getActionsGroupAdd()) {
        final ApplierContext appCtx = makeResolvedAttribute(null, action, action.willGroupAdd,
                action.doGroupAdd, applyModifiers, "group", arc, attCtxContainerGroup, attCtxContainer);

        // save it
        if (appCtx.resAttNew != null) {
          resAttOut.add(appCtx.resAttNew);
        }
      }
    }

    // now starts a repeating pattern of rounds
    // first step is to get attribute that are descriptions of the round.
    // do this once and then use them as the first entries in the first set of 'previous' atts for the loop
    // make an attribute context to hold attributes that are generated from appliers in this round
    int round = 0;
    if (attCtxContainerGroup != null) {
      final AttributeContextParameters acp = new AttributeContextParameters();
      acp.setUnder(attCtxContainerGroup);
      acp.setType(CdmAttributeContextType.GeneratedRound);
      acp.setName("_generatedAttributeRound0");

      attCtxContainer = CdmAttributeContext.createChildUnder(arc.getResOpt(), acp);
    }

    List<ResolvedAttribute> resAttsLastRound = new ArrayList<>();

    if (caps.canRoundAdd && arc.getActionsRoundAdd() != null) {
      for (final AttributeResolutionApplier action : arc.getActionsRoundAdd()) {
        final ApplierContext appCtx = makeResolvedAttribute(null, action, action.willRoundAdd,
                action.doRoundAdd, applyModifiers, "round", arc, attCtxContainerGroup, attCtxContainer);

        // save it
        if (appCtx.resAttNew != null) {
          // overall list
          resAttOut.add(appCtx.resAttNew);
          // previous list
          resAttsLastRound.add(appCtx.resAttNew);
        }
      }
    }

    // the first per-round set of attributes is the set owned by this object
    resAttsLastRound.addAll(resolvedAttributeSet.getSet());

    // now loop over all of the previous atts until they all say 'stop'
    if (resAttsLastRound.size() > 0) {
      int continues;

      do {
        continues = 0;
        final List<ResolvedAttribute> resAttThisRound = new ArrayList<>();
        if (caps.canAttributeAdd) {
          for (ResolvedAttribute resolvedAttribute : resAttsLastRound) {
            if (arc.getActionsAttributeAdd() != null) {
              for (final AttributeResolutionApplier action : arc.getActionsAttributeAdd()) {
                final ApplierContext appCtx = makeResolvedAttribute(
                    resolvedAttribute,
                    action,
                    action.willAttributeAdd,
                    action.doAttributeAdd,
                    applyModifiers,
                    "detail",
                    arc,
                    attCtxContainerGroup,
                    attCtxContainer);

                // save it
                if (appCtx.resAttNew != null) {
                  // overall list
                  resAttOut.add(appCtx.resAttNew);
                  resAttThisRound.add(appCtx.resAttNew);
                  if (appCtx.continues != null && appCtx.continues) {
                    continues++;
                  }
                }
              }
            }
          }
        }
        resAttsLastRound = resAttThisRound;

        round++;
        if (attCtxContainerGroup != null) {
          final AttributeContextParameters acp = new AttributeContextParameters();
          acp.setUnder(attCtxContainerGroup);
          acp.setType(CdmAttributeContextType.GeneratedRound);
          acp.setName("_generatedAttributeRound" + round);

          attCtxContainer = CdmAttributeContext.createChildUnder(arc.getResOpt(), acp);
        }
      } while (continues > 0);
    }

    return resAttOut;
  }

  private ApplierContext makeResolvedAttribute(final ResolvedAttribute resAttSource,
                                               final AttributeResolutionApplier action,
                                               final Function queryAdd,
                                               final Consumer doAdd,
                                               final boolean applyModifiers,
                                               final String state,
                                               final AttributeResolutionContext arc,
                                               final CdmAttributeContext attCtxContainerGroup,
                                               final CdmAttributeContext attCtxContainer) {
    final ApplierContext appCtx = new ApplierContext();
    appCtx.state = state;
    appCtx.resOpt = arc.getResOpt();
    appCtx.attCtx = attCtxContainer;
    appCtx.resAttSource = resAttSource;
    appCtx.resGuide = arc.getResGuide();

    if (resAttSource != null && (resAttSource.getTarget() instanceof ResolvedAttributeSet)
            && ((ResolvedAttributeSet) resAttSource.getTarget()).getSet() != null) {
      return appCtx; // makes no sense for a group
    }

    // will something add
    if ((Boolean) queryAdd.apply(appCtx)) {
      // may want to make a new attribute group
      // make the 'new' attribute look like any source attribute for the duration of this call to make a context. there could be state needed
      appCtx.resAttNew = resAttSource;
      if (resolvedAttributeSet.getAttributeContext() != null && action.willCreateContext != null
              && action.willCreateContext.apply(appCtx)) {
        action.doCreateContext.accept(appCtx);
      }

      // make a new resolved attribute as a place to hold results
      appCtx.resAttNew = new ResolvedAttribute(appCtx.resOpt, null, null,
          appCtx.attCtx);

      // copy state from source
      if (resAttSource != null && resAttSource.getApplierState() != null) {
        appCtx.resAttNew.setApplierState(resAttSource.getApplierState().copy());
      } else {
        appCtx.resAttNew.setApplierState(new ApplierState());
      }

      // if applying traits, then add the sets traits as a starting point
      if (applyModifiers) {
        appCtx.resAttNew.setResolvedTraits(arc.getTraitsToApply().deepCopy());
      }

      // make it
      doAdd.accept(appCtx);

      // combine resolution guidance for this set with anything new from the new attribute
      appCtx.resGuideNew = appCtx.resGuide
              .combineResolutionGuidance(appCtx.resGuideNew);
      appCtx.resAttNew.setArc(new AttributeResolutionContext(arc.getResOpt(),
          appCtx.resGuideNew,
              appCtx.resAttNew.fetchResolvedTraits()));

      if (applyModifiers) {
        // add the sets traits back in to this newly added one
        appCtx.resAttNew.setResolvedTraits(
                appCtx.resAttNew.fetchResolvedTraits().mergeSet(arc.getTraitsToApply()));

        // be sure to use the new arc, the new attribute may have added actions. For now, only modify and remove will get acted on because recursion. ugh.
        // do all of the modify traits
        if (appCtx.resAttNew.getArc().getApplierCaps().canAttributeModify) {
          // modify acts on the source and we should be done with it
          appCtx.resAttSource = appCtx.resAttNew;
          for (final AttributeResolutionApplier modAct : appCtx.resAttNew.getArc().getActionsModify()) {
            if (modAct.willAttributeModify.apply(appCtx)) {
              modAct.doAttributeModify.accept(appCtx);
            }
          }
        }
      }

      appCtx.resAttNew.completeContext(appCtx.resOpt);
    }

    return appCtx;
  }

  /**
   *
   * @return
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public ResolvedAttributeSet getResolvedAttributeSet() {
    return resolvedAttributeSet;
  }

  public int getInheritedMark() {
    return inheritedMark;
  }

  public void setInheritedMark(final int inheritedMark) {
    this.inheritedMark = inheritedMark;
  }
}

