// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.resolvedmodel;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitDefinition;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

/**
 * @deprecated This class is extremely likely to be removed in the public interface, and not meant
 * to be called externally at all. Please refrain from using it.
 */
@Deprecated
public class ResolvedTraitSetBuilder {

  private ResolvedTraitSet resolvedTraitSet;
  // public ResolveOptions ResOpt { get; set; }

  public void clear() {
    resolvedTraitSet = null;
  }

  /**
   *
   * @param rtsNew
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public void mergeTraits(final ResolvedTraitSet rtsNew) {
    if (rtsNew != null) {
      if (resolvedTraitSet == null) {
        resolvedTraitSet = new ResolvedTraitSet(rtsNew.getResOpt());
      }
      resolvedTraitSet = resolvedTraitSet.mergeSet(rtsNew);
    }
  }

  /**
   *
   * @param rtsNew
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public void takeReference(final ResolvedTraitSet rtsNew) {
    resolvedTraitSet = rtsNew;
  }

  public void ownOne(final ResolvedTrait rt, final ResolveOptions resOpt) {
    resolvedTraitSet = new ResolvedTraitSet(resOpt);
    resolvedTraitSet.merge(rt, false);
  }

  public void setTraitParameterValue(final ResolveOptions resOpt, final CdmTraitDefinition toTrait, final String paramName,
                                     final Object value) {
    resolvedTraitSet = resolvedTraitSet.setTraitParameterValue(resOpt, toTrait, paramName, value);
  }

  public void replaceTraitParameterValue(final ResolveOptions resOpt, final String toTrait, final String paramName,
                                         final Object valueWhen, final Object valueNew) {
    if (resolvedTraitSet != null) {
      resolvedTraitSet = resolvedTraitSet
          .replaceTraitParameterValue(resOpt, toTrait, paramName, valueWhen, valueNew);
    }
  }

  /**
   *
   * @return
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public ResolvedTraitSet getResolvedTraitSet() {
    return resolvedTraitSet;
  }

  /**
   *
   * @param resolvedTraitSet
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public void setResolvedTraitSet(final ResolvedTraitSet resolvedTraitSet) {
    this.resolvedTraitSet = resolvedTraitSet;
  }
}
