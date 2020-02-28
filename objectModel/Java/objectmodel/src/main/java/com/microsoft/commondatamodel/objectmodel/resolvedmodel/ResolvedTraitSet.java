// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.resolvedmodel;

import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmArgumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.StringSpewCatcher;
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
import org.apache.commons.lang3.StringUtils;

/**
 * @deprecated This class is extremely likely to be removed in the public interface, and not meant
 * to be called externally at all. Please refrain from using it.
 */
@Deprecated
public class ResolvedTraitSet {

  private List<ResolvedTrait> set;
  private Boolean hasElevated;
  private ResolveOptions resOpt;
  private Map<CdmTraitDefinition, ResolvedTrait> lookupByTrait;

  public ResolvedTraitSet(final ResolveOptions resOpt) {
    this.resOpt = resOpt.copy();
    this.set = new ArrayList<>();
    this.lookupByTrait = new LinkedHashMap<>();
    this.hasElevated = false;
  }

  public ResolvedTraitSet merge(ResolvedTrait toMerge, Boolean copyOnWrite) {
    ResolvedTraitSet traitSetResult = this;
    final CdmTraitDefinition trait = toMerge.getTrait();
    List<Object> av = null;
    List<Boolean> wasSet = null;

    if (toMerge.getParameterValues() != null) {
      av = toMerge.getParameterValues().getValues();
      wasSet = toMerge.getParameterValues().getWasSet();
    }

    if (!this.getHasElevated())  {
      this.setHasElevated(trait.getElevated() == null ? false : trait.getElevated());
    }

    if (traitSetResult.getLookupByTrait().containsKey(trait)) {
      ResolvedTrait rtOld = traitSetResult.getLookupByTrait().get(trait);
      List<Object> avOld = null;

      if (rtOld.getParameterValues() != null) {
        avOld = rtOld.getParameterValues().getValues();
      }

      if (av != null && avOld != null) {
        // the new values take precedence
        for (int i = 0; i < av.size(); i++) {
          if (avOld.get(i) != null && avOld.get(i) instanceof JsonNode) {
            avOld.set(i, ((JsonNode) avOld.get(i)).asText());
          }

          try {
            if (av.get(i) != avOld.get(i)) {
              if (copyOnWrite) {
                traitSetResult = traitSetResult.shallowCopyWithException(trait);
                rtOld = traitSetResult.getLookupByTrait().get(trait);
                avOld = rtOld.getParameterValues().getValues();
                copyOnWrite = false;
              }

              avOld.set(i, ParameterValue
                  .fetchReplacementValue(resOpt, avOld.get(i), av.get(i), wasSet.get(i)));
            }
          } catch (final Exception ex) {
            // Do something?
          }
        }
      }
    } else {
      if (copyOnWrite) {
        traitSetResult = traitSetResult.shallowCopy();
      }

      toMerge = toMerge.copy();
      traitSetResult.getSet().add(toMerge);
      traitSetResult.getLookupByTrait().put(trait, toMerge);
    }

    return traitSetResult;
  }

  ResolvedTraitSet mergeSet(final ResolvedTraitSet toMerge) {
    return mergeSet(toMerge, false);
  }

  public ResolvedTraitSet mergeSet(final ResolvedTraitSet toMerge, final Boolean elevatedOnly) {
    Boolean copyOnWrite = true;
    ResolvedTraitSet traitSetResult = this;

    if (toMerge != null) {
      final int l = toMerge.getSet().size();

      for (int i = 0; i < l; i++) {
        final ResolvedTrait rt = toMerge.getSet().get(i);

        if (!elevatedOnly || (rt.getTrait().getElevated() != null && rt.getTrait().getElevated())) {
          final ResolvedTraitSet traitSetMerge = traitSetResult.merge(rt, copyOnWrite);

          if (traitSetMerge != traitSetResult) {
            traitSetResult = traitSetMerge;
            copyOnWrite = false;
          }
        }
      }
    }

    return traitSetResult;
  }

  public ResolvedTrait get(final CdmTraitDefinition trait) {
    if (getLookupByTrait().containsKey(trait)) {
      return getLookupByTrait().get(trait);
    }

    return null;
  }

  public ResolvedTrait find(final ResolveOptions resOpt, final String traitName) {
    for (final ResolvedTrait rt : set) {
      if (rt.getTrait().isDerivedFrom(traitName, resOpt)) {
        return rt;
      }
    }

    return null;
  }

  public ResolvedTraitSet deepCopy() {
    final ResolvedTraitSet copy = new ResolvedTraitSet(resOpt);
    final List<ResolvedTrait> newSet = copy.getSet();

    for (ResolvedTrait rt : set) {
      rt = rt.copy();
      newSet.add(rt);
      copy.getLookupByTrait().put(rt.getTrait(), rt);
    }

    copy.setHasElevated(hasElevated);

    return copy;
  }

  private ResolvedTraitSet shallowCopyWithException(final CdmTraitDefinition just) {
    final ResolvedTraitSet copy = new ResolvedTraitSet(resOpt);
    final List<ResolvedTrait> newSet = copy.getSet();

    for (ResolvedTrait rt : set) {
      if (rt.getTrait() == just) {
        rt = rt.copy();
      }

      newSet.add(rt);
      copy.getLookupByTrait().put(rt.getTrait(), rt);
    }

    copy.setHasElevated(hasElevated);

    return copy;
  }

  ResolvedTraitSet shallowCopy() {
    final ResolvedTraitSet copy = new ResolvedTraitSet(resOpt);

    if (set != null) {
      final List<ResolvedTrait> newSet = copy.getSet();

      for (final ResolvedTrait rt : set) {
        newSet.add(rt);
        copy.getLookupByTrait().put(rt.getTrait(), rt);
      }
    }

    copy.setHasElevated(hasElevated);

    return copy;
  }

  Set<String> collectTraitNames() {
    final Set<String> collection = new LinkedHashSet<String>();

    if (set != null) {
      for (final ResolvedTrait rt : set) {
        rt.collectTraitNames(resOpt, collection);
      }
    }

    return collection;
  }

  public void setParameterValueFromArgument(final CdmTraitDefinition trait, final CdmArgumentDefinition arg) {
    final ResolvedTrait resTrait = get(trait);

    if (resTrait != null && resTrait.getParameterValues() != null) {
      final List<Object> av = resTrait.getParameterValues().getValues();
      final Object newVal = arg.getValue();
      // get the value index from the parameter collection given the parameter that this argument is setting
      final int iParam = resTrait.getParameterValues().indexOf(arg.getParameterDef());
      av.set(iParam, ParameterValue.fetchReplacementValue(resOpt, av.get(iParam), newVal, true));
      resTrait.getParameterValues().getWasSet().set(iParam, true);
    }
  }

  public ResolvedTraitSet setTraitParameterValue(final ResolveOptions resOpt, final CdmTraitDefinition toTrait,
                                                 final String paramName, final Object value) {
    final ResolvedTraitSet altered = shallowCopyWithException(toTrait);
    altered.get(toTrait).getParameterValues().setParameterValue(resOpt, paramName, value);
    return altered;
  }

  ResolvedTraitSet replaceTraitParameterValue(
      final ResolveOptions resOpt,
      final String toTrait,
      final String paramName,
      final Object valueWhen, final Object valueNew) {
    ResolvedTraitSet traitSetResult = this;

    for (int i = 0; i < traitSetResult.getSet().size(); i++) {
      ResolvedTrait rt = traitSetResult.getSet().get(i);

      if (rt.getTrait().isDerivedFrom(toTrait, resOpt)) {
        if (rt.getParameterValues() != null) {
          final ParameterCollection pc = rt.getParameterValues().getPc();
          List<Object> av = rt.getParameterValues().getValues();
          final int idx = pc.fetchParameterIndex(paramName);

          if (idx >= 0) {
            try {
              if (Objects.equals(av.get(idx), valueWhen)) {
                // copy the set and make a deep copy of the trait being set
                traitSetResult = shallowCopyWithException(rt.getTrait());
                // assume these are all still true for this copy
                rt = traitSetResult.getSet().get(i);
                av = rt.getParameterValues().getValues();
                av.set(idx,
                    ParameterValue.fetchReplacementValue(resOpt, av.get(idx), valueNew, true));
                break;
              }
            } catch (final Exception ex) {
              // Do nothing?
            }
          }
        }
      }
    }

    return traitSetResult;
  }

  public void spew(final ResolveOptions resOpt, final StringSpewCatcher to, final String indent, final Boolean nameSort)
      throws IOException {
    final List<ResolvedTrait> list = new ArrayList<>(set);

    if (nameSort) {
      list.sort((l, r) -> StringUtils.compareIgnoreCase(l.getTraitName(), r.getTraitName(), true));
    }

    for (final ResolvedTrait trait : list) {
      trait.spew(resOpt, to, indent);
    }
  }

  public List<ResolvedTrait> getSet() {
    return set;
  }

  public void setSet(final List<ResolvedTrait> set) {
    this.set = set;
  }

  public Boolean getHasElevated() {
    return hasElevated;
  }

  public void setHasElevated(final Boolean hasElevated) {
    this.hasElevated = hasElevated;
  }

  public ResolveOptions getResOpt() {
    return resOpt;
  }

  void setResOpt(final ResolveOptions resOpt) {
    this.resOpt = resOpt;
  }

  public int getSize() {
    return set != null ? set.size() : 0;
  }

  public ResolvedTrait getFirst() {
    return set != null ? set.get(0) : null;
  }

  public Map<CdmTraitDefinition, ResolvedTrait> getLookupByTrait() {
    return lookupByTrait;
  }

  public void setLookupByTrait(final Map<CdmTraitDefinition, ResolvedTrait> lookupByTrait) {
    this.lookupByTrait = lookupByTrait;
  }

  public class CaseAgnosticTraitNameComparator implements Comparator<ResolvedTrait> {

    public int compare(final ResolvedTrait l, final ResolvedTrait r) {
      return l.getTraitName().toLowerCase().compareTo(r.getTraitName().toLowerCase());
    }
  }
}
