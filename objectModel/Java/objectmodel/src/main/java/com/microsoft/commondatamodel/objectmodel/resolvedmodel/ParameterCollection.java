// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.resolvedmodel;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmParameterDefinition;
import com.microsoft.commondatamodel.objectmodel.utilities.exceptions.CdmException;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * @deprecated This class is extremely likely to be removed in the public interface, and not meant
 * to be called externally at all. Please refrain from using it.
 */
@Deprecated
public class ParameterCollection {

  List<CdmParameterDefinition> sequence;
  Map<String, CdmParameterDefinition> lookup;
  Map<CdmParameterDefinition, Integer> ordinals;

  public ParameterCollection(
      final com.microsoft.commondatamodel.objectmodel.resolvedmodel.ParameterCollection prior) {
    if (prior == null) {
      this.setSequence(new ArrayList<>());
      this.setLookup(new LinkedHashMap<>());
      this.setOrdinals(new LinkedHashMap<>());
    } else {
      this.setSequence(
          prior.getSequence() != null ? new ArrayList<>(prior.getSequence()) : new ArrayList<>());
      this.setLookup(
          prior.getLookup() != null ? new LinkedHashMap<>(prior.getLookup()) : new LinkedHashMap<>()
      );
      this.setOrdinals(
          prior.getOrdinals() != null ? new LinkedHashMap<>(prior.getOrdinals()) : new LinkedHashMap<>()
      );
    }
  }

  public void add(final CdmParameterDefinition element) throws CdmException {
    final String name = element.getName();

    if (!StringUtils.isNullOrEmpty(name)) {
      if (lookup.containsKey(name)) {
        // why not just replace the old one?
        this.lookup.put(name, element);
        this.sequence.set(this.sequence.indexOf(this.sequence.stream().filter(e ->  e.getName().equals(name)).findFirst()), element);
        this.ordinals.put(element, this.sequence.size());
        return;
      } else {
        lookup.put(name, element);
      }
    }

    ordinals.put(element, sequence.size());
    sequence.add(element);
  }

  public CdmParameterDefinition resolveParameter(final int ordinal, final String name) throws CdmException {
    if (!StringUtils.isNullOrEmpty(name)) {
      if (lookup.containsKey(name)) {
        return lookup.get(name);
      } else {
        throw new CdmException("There is no parameter named " + name);
      }
    }

    if (ordinal >= sequence.size()) {
      throw new CdmException("Too many arguments supplied");
    }

    return sequence.get(ordinal);
  }

  public int fetchParameterIndex(final String paramName) {
    return ordinals.get(lookup.get(paramName));
  }

  public List<CdmParameterDefinition> getSequence() {
    return sequence;
  }

  void setSequence(final List<CdmParameterDefinition> sequence) {
    this.sequence = sequence;
  }

  Map<String, CdmParameterDefinition> getLookup() {
    return lookup;
  }

  void setLookup(final Map<String, CdmParameterDefinition> lookup) {
    this.lookup = lookup;
  }

  Map<CdmParameterDefinition, Integer> getOrdinals() {
    return ordinals;
  }

  void setOrdinals(final Map<CdmParameterDefinition, Integer> ordinals) {
    this.ordinals = ordinals;
  }
}
