// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.resolvedmodel;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmParameterDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReferenceBase;
import com.microsoft.commondatamodel.objectmodel.cdm.StringSpewCatcher;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * @deprecated This class is extremely likely to be removed in the public interface, and not meant
 * to be called externally at all. Please refrain from using it.
 */
@Deprecated
public class ResolvedTrait {

  private CdmTraitDefinition trait;
  private ParameterValueSet parameterValues;
  private CdmTraitReference explicitVerb;
  private List<CdmTraitReferenceBase> metaTraits;

  /**
   *
   * @param trait CdmTraitDefinition
   * @param parameterCollection ParameterCollection
   * @param values List of Object
   * @param wasSet List of Boolean
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public ResolvedTrait(final CdmTraitDefinition trait, final ParameterCollection parameterCollection,
                       final List<Object> values, final List<Boolean> wasSet,
                       final CdmTraitReference explicitVerb, final List<CdmTraitReferenceBase> metaTraits) {
    if (parameterCollection != null && parameterCollection.sequence != null
        && parameterCollection.sequence.size() > 0) {
      parameterValues = new ParameterValueSet(trait.getCtx(), parameterCollection, values, wasSet);
    }

    this.trait = trait;
    this.explicitVerb = explicitVerb;
    if (metaTraits != null) {
      this.metaTraits = new ArrayList<CdmTraitReferenceBase>(metaTraits);
    }
  }

  public String getTraitName() {
    return trait != null ? trait.getDeclaredPath() : null;
  }
  
  public void setExplicitVerb(CdmTraitReference value) {
    this.explicitVerb = value;
  }
  public CdmTraitReference getExplicitVerb() {
    return this.explicitVerb;
  }
  
  public void setMetaTraits(List<CdmTraitReferenceBase> value) {
    this.metaTraits = value;
  }
  public List<CdmTraitReferenceBase> getMetaTraits() {
    return this.metaTraits;
  }

  public void spew(final ResolveOptions resOpt, final StringSpewCatcher to, final String indent)
      throws IOException {
    to.spewLine(indent + "[" + getTraitName() + "]");
    if (parameterValues != null) {
      parameterValues.spew(resOpt, to, indent + '-');
    }
  }

  public ResolvedTrait copy() {
    ParameterCollection pc = null;
    List<Object> values = null;
    List<Boolean> wasSet = null;
    List<CdmTraitReferenceBase> metaTraits = null;
    if (parameterValues != null) {
      final ParameterValueSet copyParamValues = parameterValues.copy();
      pc = copyParamValues.getPc();
      values = copyParamValues.getValues();
      wasSet = copyParamValues.getWasSet();
    }
    if (this.metaTraits != null) {
      metaTraits = new ArrayList<CdmTraitReferenceBase>(this.metaTraits);
    }

    return new ResolvedTrait(trait, pc, values, wasSet, this.explicitVerb, metaTraits);
  }

  /**
   * Adds a 'meta' trait to a resolved trait object
   * collection stays null until used to save space
   * <param name="trait"> the trait reference to place in the metaTraits collection</param>
   * <param name="verb"> a verb trait to use along with the ref. can be null for default verb</param>
   */
  public void addMetaTrait(CdmTraitReference trait, CdmTraitReference verb) {
      if (this.metaTraits == null) {
          this.metaTraits = new ArrayList<CdmTraitReferenceBase>();
      }
      trait.setVerb(verb);
      this.metaTraits.add(trait);
  }

  public void collectTraitNames(final ResolveOptions resOpt, final Set<String> into) {
    CdmTraitDefinition currentTrait = trait;
    while (currentTrait != null) {
      into.add(currentTrait.getName());
      final CdmTraitReference baseRef = currentTrait.getExtendsTrait();
      currentTrait = baseRef != null ? (CdmTraitDefinition) baseRef.fetchObjectDefinition(resOpt) : null;
    }
  }

  public CdmTraitDefinition getTrait() {
    return trait;
  }

  public void setTrait(final CdmTraitDefinition trait) {
    this.trait = trait;
  }

  /**
   *
   * @return ParameterValueSet
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public ParameterValueSet getParameterValues() {
    return parameterValues;
  }

  /**
   * creates a TraitProfile from a resolved trait
   * normally these would come from a trait reference or definition, so we need to 
   * put some things back together to make this look right
   * <param name="resOpt"></param>
   * <param name="cache">optional cache object to speed up and make consistent the fetching of profiles for a larger set of objects</param>
   * <param name="forVerb">optional 'verb' name to use as a filter. I only want profiles applied with 'means' for example</param>
   * <returns>the profile object, perhaps from the cache</returns>
   */
  public TraitProfile fetchTraitProfile(ResolveOptions resOpt) {
    return fetchTraitProfile(resOpt, null, null);
  }
  public TraitProfile fetchTraitProfile(ResolveOptions resOpt, TraitProfileCache cache) {
    return fetchTraitProfile(resOpt, cache, null);
  }
  public TraitProfile fetchTraitProfile(ResolveOptions resOpt, TraitProfileCache cache, String forVerb) {
      if (cache == null) {
          cache = new TraitProfileCache();
      }
      // start with the profile of the definition
      TraitProfile definition = TraitProfile._traitDefToProfile(this.trait, resOpt, false, false, cache);
      TraitProfile result;

      // encapsulate and promote
      result = new TraitProfile();
      result.setReferences(definition);
      result.setTraitName(definition.getTraitName());

      // move over any verb set or metatraits set on this reference
      if (this.explicitVerb != null) {
          result.setVerb(TraitProfile._traitRefToProfile(this.explicitVerb, resOpt, true, true, true, cache));
      }
      if (result.getVerb() != null && forVerb != null && !result.getVerb().getTraitName().equals(forVerb)) {
          // filter out now
          result = null;
      }
      else {
          if (this.metaTraits != null) {
              result.setMetaTraits(TraitProfile.traitCollectionToProfileList(this.metaTraits, resOpt, result.getMetaTraits(), true, cache));
              result.removeClassifiersFromMeta();
          }

          // if there are arguments set in this resolved trait, list them
          if (this.getParameterValues() != null && this.getParameterValues().length() > 0) {
              Map<String, Object> argMap = new HashMap<String, Object>();
              int l = this.getParameterValues().length();
              for (int i = 0; i < l; i++) {
                  CdmParameterDefinition p = this.getParameterValues().fetchParameter(i);
                  Object v = this.getParameterValues().fetchValue(i);
                  String name = p.getName();
                  if (name == null) {
                      name = Integer.toString(i);
                  }
                  Object value = TraitProfile.fetchProfileArgumentFromTraitArgument(v, resOpt);
                  if (value != null) {
                      argMap.put(name, value);
                  }
              }

              if (argMap.size() > 0) {
                  result.setArgumentValues(argMap);
              }
          }
      }
      return result;
  }
}
