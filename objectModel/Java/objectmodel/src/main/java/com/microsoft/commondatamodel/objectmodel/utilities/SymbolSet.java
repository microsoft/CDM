// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities;

import java.util.Iterator;
import java.util.LinkedHashSet;
import java.util.Set;

/**
 * @deprecated This class is extremely likely to be removed in the public interface, and not meant
 * to be called externally at all. Please refrain from using it.
 */
@Deprecated
public class SymbolSet implements Iterable<String> {

  private final Set<String> symbolSetCollection;

  /**
   * Default constructor.
   * 
   * @deprecated This class is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public SymbolSet() {
    symbolSetCollection = new LinkedHashSet<>();
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @return int
   */
  @Deprecated
  public int getSize() {
    return symbolSetCollection.size();
  }

  /**
   * Adds specified symbol to this set.
   *
   * @param newSymbol The symbol to add
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public void add(final String newSymbol) {
    symbolSetCollection.add(newSymbol);
  }

  /**
   * Merges the given symbol set with this set.
   *
   * @param symSet The symbol set to merge
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  public void merge(final SymbolSet symSet) {
    if (symSet != null) {
      for (final String sym : symSet) {
        symbolSetCollection.add(sym);
      }
    }
  }

  /**
   * Creates a copy of this set.
   * 
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @return SymbolSet
   */
  @Deprecated
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
