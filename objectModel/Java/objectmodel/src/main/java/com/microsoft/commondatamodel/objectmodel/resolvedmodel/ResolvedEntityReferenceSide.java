// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.resolvedmodel;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.StringSpewCatcher;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import java.io.IOException;

/**
 * @deprecated This class is extremely likely to be removed in the public interface, and not meant
 * to be called externally at all. Please refrain from using it.
 */
@Deprecated
public class ResolvedEntityReferenceSide {

  private CdmEntityDefinition entity;
  private ResolvedAttributeSetBuilder resolvedAttributeSetBuilder;

  /**
   *
   * @param entity CdmEntityDefinition
   * @param rasb ResolvedAttributeSetBuilder
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public ResolvedEntityReferenceSide(final CdmEntityDefinition entity, final ResolvedAttributeSetBuilder rasb) {
    if (entity != null) {
      this.entity = entity;
    }
    if (rasb != null) {
      this.resolvedAttributeSetBuilder = rasb;
    } else {
      this.resolvedAttributeSetBuilder = new ResolvedAttributeSetBuilder();
    }
  }

  public void spew(final ResolveOptions resOpt, final StringSpewCatcher to, final String indent, final Boolean nameSort)
      throws IOException {
    to.spewLine(indent + " ent=" + (entity != null ? entity.getName() : null));

    if (resolvedAttributeSetBuilder != null
        && resolvedAttributeSetBuilder.getResolvedAttributeSet() != null) {
      resolvedAttributeSetBuilder.getResolvedAttributeSet()
          .spew(resOpt, to, indent + "  atts:", nameSort);
    }
  }

  public CdmEntityDefinition getEntity() {
    return entity;
  }

  public void setEntity(final CdmEntityDefinition entity) {
    this.entity = entity;
  }

  /**
   *
   * @return ResolvedAttributeSetBuilder
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public ResolvedAttributeSetBuilder getResolvedAttributeSetBuilder() {
    return resolvedAttributeSetBuilder;
  }

  /**
   *
   * @param resolvedAttributeSetBuilder ResolvedAttributeSetBuilder
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public void setResolvedAttributeSetBuilder(
      final ResolvedAttributeSetBuilder resolvedAttributeSetBuilder) {
    this.resolvedAttributeSetBuilder = resolvedAttributeSetBuilder;
  }
}

