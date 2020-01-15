package com.microsoft.commondatamodel.objectmodel.resolvedmodel;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.StringSpewCatcher;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import org.apache.commons.lang3.ObjectUtils;

public class ResolvedEntityReferenceSet {

  List<ResolvedEntityReference> set;
  ResolveOptions resOpt;

  public ResolvedEntityReferenceSet(final ResolveOptions resOpt) {
    this.resOpt = resOpt;
    this.set = new ArrayList<ResolvedEntityReference>();
  }

  private ResolvedEntityReferenceSet(final ResolveOptions resOpt, final List<ResolvedEntityReference> set) {
    this.resOpt = resOpt;
    this.set = set;
  }

  public void add(final ResolvedEntityReferenceSet toAdd) {
    if (toAdd != null && toAdd.getSet() != null && toAdd.getSet().size() > 0) {
      set.addAll(toAdd.getSet());
    }
  }

  public ResolvedEntityReferenceSet copy() {
    final List<ResolvedEntityReference> newSet = new ArrayList<ResolvedEntityReference>(set);

    for (int i = 0; i < newSet.size(); i++) {
      newSet.set(i, newSet.get(i).copy());
    }

    return new ResolvedEntityReferenceSet(resOpt, newSet);
  }

  public ResolvedEntityReferenceSet findEntity(final CdmEntityDefinition entOther) {
    // make an array of just the refs that include the requested
    final List<ResolvedEntityReference> filter = new ArrayList<ResolvedEntityReference>();

    for (final ResolvedEntityReference rer : set) {
      if (rer.getReferenced().stream().filter(rers -> rers.getEntity() == entOther).count() > 0) {
      }
      filter.add(rer);
    }

    if (filter.size() == 0) {
      return null;
    }

    return new ResolvedEntityReferenceSet(resOpt, filter);
  }

  /**
   *
   * @param resOpt
   * @param to
   * @param indent
   * @param nameSort
   * @throws IOException
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public void spew(final ResolveOptions resOpt, final StringSpewCatcher to, final String indent, final boolean nameSort)
      throws IOException {
    final List<ResolvedEntityReference> list = new ArrayList<>(set);

    if (nameSort) {
      list.sort(new CaseAgnosticEntityRefNameComparator());
    }

    for (int i = 0; i < set.size(); i++) {
      list.get(i).spew(resOpt, to, indent + "(rer[" + i + "])", nameSort);
    }
  }

  public List<ResolvedEntityReference> getSet() {
    return set;
  }

  void setSet(final List<ResolvedEntityReference> set) {
    this.set = set;
  }

  ResolveOptions getResOpt() {
    return resOpt;
  }

  void setResOpt(final ResolveOptions resOpt) {
    this.resOpt = resOpt;
  }

  private class CaseAgnosticEntityRefNameComparator implements Comparator<ResolvedEntityReference> {

    public int compare(final ResolvedEntityReference l, final ResolvedEntityReference r) {
      if (l.getReferenced() != null && l.getReferenced().size() > 0) {
        if (r.getReferenced() != null && r.getReferenced().size() > 0) {
          final String lEntityName =
              l.getReferenced().get(0).getEntity() != null ? l.getReferenced().get(0).getEntity()
                  .getName().toLowerCase() : null;
          final String rEntityName =
              r.getReferenced().get(0).getEntity() != null ? r.getReferenced().get(0).getEntity()
                  .getName().toLowerCase() : null;

          return ObjectUtils.compare(lEntityName,rEntityName);
        }

        return 1;
      }

      return -1;
    }
  }
}
