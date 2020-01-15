// Copyright (c) Microsoft Corporation.

package com.microsoft.commondatamodel.objectmodel.utilities;

import java.util.Iterator;
import java.util.LinkedHashSet;
import java.util.Set;

/**
 * @deprecated This class is extremely likely to be removed in the public interface, and not meant
 * to be called externally at all. Please refrain from using it.
 */
public class SymbolSet implements Iterable<String> {

  private final Set<String> symbolSetCollection;

  /**
   * Default constructor.
   */
  public SymbolSet() {
    symbolSetCollection = new LinkedHashSet<>();
  }

  public int getSize() {
    return symbolSetCollection.size();
  }

  /**
   * Adds specified symbol to this set.
   *
   * @param newSymbol The symbol to add
   */
  public void add(final String newSymbol) {
    symbolSetCollection.add(newSymbol);
  }

  /**
   * Merges the given symbol set with this set.
   *
   * @param symSet The symbol set to merge
   */
  public void merge(final SymbolSet symSet) {
    if (symSet != null) {
      for (final String sym : symSet) {
        symbolSetCollection.add(sym);
      }
    }
  }

  /**
   * Creates a copy of this set.
   */
  public SymbolSet copy() {
    final SymbolSet newSet = new SymbolSet();

    for (final String sym : symbolSetCollection) {
      newSet.add(sym);
    }

    return newSet;
  }

  @Override
  public Iterator<String> iterator() {
    return symbolSetCollection.iterator();
  }
}
