// Copyright (c) Microsoft Corporation.

package com.microsoft.commondatamodel.objectmodel.utilities;

import com.google.common.base.Strings;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

/**
 * Directives controlling the attribute resolution.
 */
public class AttributeResolutionDirectiveSet {
  private Set<String> set;
  private Set<String> setRemoved;
  private String sortedTag;

  /**
   * Constructor.
   */
  public AttributeResolutionDirectiveSet() {
  }

  /**
   * Constructor initialized with the given set of directives.
   *
   * @param set CdmAttribute resolution directives set
   */
  public AttributeResolutionDirectiveSet(final Set<String> set) {
    this.set = new LinkedHashSet<>(set);
  }

  /**
   * Create a copy of this object.
   */
  public AttributeResolutionDirectiveSet copy() {
    final AttributeResolutionDirectiveSet result = new AttributeResolutionDirectiveSet();

    if (set != null) {
      result.setSet(new LinkedHashSet<>(set));
    }

    if (setRemoved != null) {
      result.setSetRemoved(new LinkedHashSet<>(setRemoved));
    }

    result.setSortedTag(sortedTag);

    return result;
  }

  /**
   * Returns true if this set contains the specified directive.
   *
   * @param directive Directive to check
   */
  public boolean has(final String directive) {
    if (set != null) {
      return set.contains(directive);
    }

    return false;
  }

  /**
   * Adds the specified directive to this set.
   *
   * @param directive The directive to add
   */
  public void add(final String directive) {
    if (set == null) {
      set = new LinkedHashSet<>();
    }

    // once explicitly removed from a set, never put it back
    if (setRemoved != null && setRemoved.contains(directive)) {
      return;
    }

    set.add(directive);
    sortedTag = null;
  }

  /**
   * Deletes the specified directive from this set.
   *
   * @param directive The directive to delete
   */
  public void delete(final String directive) {
    if (setRemoved == null) {
      setRemoved = new LinkedHashSet<>();
    }

    this.getSetRemoved().add(directive);

    if (set != null) {
      set.remove(directive);
    }

    sortedTag = null;
  }

  /**
   * Merges the given directives set with this set.
   *
   * @param directives The directives set to merge
   */
  public void merge(final AttributeResolutionDirectiveSet directives) {
    if (directives != null) {
      if (directives.getSetRemoved() != null) {
        // copy over the removed list first
        for (final String d : directives.getSetRemoved()) {
          this.delete(d);
        }
      }

      if (directives.getSet() != null) {
        set.addAll(directives.getSet());
      }

      this.setSortedTag(null);
    }
  }

  /**
   * Returns the sorted tag.
   */
  public String getTag() {
    if (Strings.isNullOrEmpty(sortedTag)) {
      if (set != null && !set.isEmpty()) {
        this.sortedTag = "";
        final StringBuilder tagBuilder = new StringBuilder();
        final List<String> sorted = new ArrayList<>(set);
        Collections.sort(sorted);

        for (final String sortedItem : sorted) {
          tagBuilder.append('-').append(sortedItem);
        }

        sortedTag = tagBuilder.toString();
      }
    }

    if (!Strings.isNullOrEmpty(sortedTag)) {
      return sortedTag;
    }

    return "";
  }

  public Set<String> getSet() {
    return this.set;
  }

  public void setSet(final Set<String> set) {
    this.set = set;
  }

  public Set<String> getSetRemoved() {
    return this.setRemoved;
  }

  public void setSetRemoved(final Set<String> setRemoved) {
    this.setRemoved = setRemoved;
  }

  public String getSortedTag() {
    return this.sortedTag;
  }

  public void setSortedTag(final String sortedTag) {
    this.sortedTag = sortedTag;
  }
}
