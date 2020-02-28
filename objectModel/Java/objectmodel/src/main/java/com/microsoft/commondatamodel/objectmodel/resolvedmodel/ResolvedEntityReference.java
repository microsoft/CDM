// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.resolvedmodel;

import com.microsoft.commondatamodel.objectmodel.cdm.StringSpewCatcher;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import org.apache.commons.lang3.StringUtils;

/**
 * @deprecated This class is extremely likely to be removed in the public interface, and not meant
 * to be called externally at all. Please refrain from using it.
 */
@Deprecated
public class ResolvedEntityReference {

  private ResolvedEntityReferenceSide referencing;
  private List<ResolvedEntityReferenceSide> referenced;

  public ResolvedEntityReference() {
    referencing = new ResolvedEntityReferenceSide(null, null);
    referenced = new ArrayList<>();
  }

  public ResolvedEntityReference copy() {
    final ResolvedEntityReference result = new ResolvedEntityReference();
    result.referencing.setEntity(referencing.getEntity());
    result.referencing.setResolvedAttributeSetBuilder(referencing.getResolvedAttributeSetBuilder());

    for (final ResolvedEntityReferenceSide rers : referenced) {
      result.referenced.add(
          new ResolvedEntityReferenceSide(rers.getEntity(), rers.getResolvedAttributeSetBuilder()));
    }

    return result;
  }

  public void spew(final ResolveOptions resOpt, final StringSpewCatcher to, final String indent, final Boolean nameSort)
      throws IOException {
    referencing.spew(resOpt, to, indent + "(referencing)", nameSort);
    final List<ResolvedEntityReferenceSide> list = new ArrayList<>(referenced);

    if (nameSort) {
      list.sort((l, r) -> {
        final String lName = l.getEntity() != null ? l.getEntity().getName(): "";
        final String rName = r.getEntity() != null ? r.getEntity().getName(): "";
        return StringUtils.compareIgnoreCase(lName, rName, true);
      });
    }

    for (int i = 0; i < referenced.size(); i++) {
      list.get(i).spew(resOpt, to, indent + "(referenced[" + i + "])", nameSort);
    }
  }

  public ResolvedEntityReferenceSide getReferencing() {
    return referencing;
  }

  public void setReferencing(final ResolvedEntityReferenceSide referencing) {
    this.referencing = referencing;
  }

  public List<ResolvedEntityReferenceSide> getReferenced() {
    return referenced;
  }

  public void setReferenced(final List<ResolvedEntityReferenceSide> referenced) {
    this.referenced = referenced;
  }
}
