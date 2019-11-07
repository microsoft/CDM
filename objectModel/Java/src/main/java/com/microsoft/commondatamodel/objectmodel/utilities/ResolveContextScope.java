package com.microsoft.commondatamodel.objectmodel.utilities;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitDefinition;

/**
 * @deprecated This class is extremely likely to be removed in the public interface, and not meant
 * to be called externally at all. Please refrain from using it.
 */
public class ResolveContextScope {
  private CdmTraitDefinition currentTrait;
  private int currentParameter;

  public void setCurrentParameter(final int currentParameter) {
    this.currentParameter = currentParameter;
  }

  public CdmTraitDefinition getCurrentTrait() {
    return currentTrait;
  }

  public int getCurrentParameter() {
    return currentParameter;
  }

  public void setCurrentTrait(final CdmTraitDefinition currentTrait) {
    this.currentTrait = currentTrait;
  }
}
