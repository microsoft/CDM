// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.resolvedmodel;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.cdm.StringSpewCatcher;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import java.io.IOException;
import java.util.List;
import java.util.Set;

/**
 * @deprecated This class is extremely likely to be removed in the public interface, and not meant
 * to be called externally at all. Please refrain from using it.
 */
@Deprecated
public class ResolvedTrait {

  private CdmTraitDefinition trait;
  private ParameterValueSet parameterValues;

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
                       final List<Object> values, final List<Boolean> wasSet) {
    if (parameterCollection != null && parameterCollection.sequence != null
        && parameterCollection.sequence.size() > 0) {
      parameterValues = new ParameterValueSet(trait.getCtx(), parameterCollection, values, wasSet);
    }

    this.trait = trait;
  }

  public String getTraitName() {
    return trait != null ? trait.getDeclaredPath() : null;
  }

  public void spew(final ResolveOptions resOpt, final StringSpewCatcher to, final String indent)
      throws IOException {
    to.spewLine(indent + "[" + getTraitName() + "]");
    if (parameterValues != null) {
      parameterValues.spew(resOpt, to, indent + '-');
    }
  }

  public ResolvedTrait copy() {
    if (parameterValues != null) {
      final ParameterValueSet copyParamValues = parameterValues.copy();
      return new ResolvedTrait(trait, copyParamValues.getPc(), copyParamValues.getValues(),
          copyParamValues.getWasSet());
    }

    return new ResolvedTrait(trait, null, null, null);
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
}
