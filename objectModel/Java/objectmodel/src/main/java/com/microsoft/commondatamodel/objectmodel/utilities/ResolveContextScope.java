// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitDefinition;

/**
 * @deprecated This class is extremely likely to be removed in the public interface, and not meant
 * to be called externally at all. Please refrain from using it.
 */
@Deprecated
public class ResolveContextScope {
  private CdmTraitDefinition currentTrait;
  private int currentParameter;

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @param currentParameter int
   */
  @Deprecated
  public void setCurrentParameter(final int currentParameter) {
    this.currentParameter = currentParameter;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @return CdmTraitDefinition
   */
  @Deprecated
  public CdmTraitDefinition getCurrentTrait() {
    return currentTrait;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @return int
   */
  @Deprecated
  public int getCurrentParameter() {
    return currentParameter;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @param currentTrait CdmTraitDefinition 
   */
  @Deprecated
  public void setCurrentTrait(final CdmTraitDefinition currentTrait) {
    this.currentTrait = currentTrait;
  }
}
