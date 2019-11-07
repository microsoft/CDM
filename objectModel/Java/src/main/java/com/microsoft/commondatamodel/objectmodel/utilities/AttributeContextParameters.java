// Copyright (c) Microsoft Corporation.

package com.microsoft.commondatamodel.objectmodel.utilities;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObject;
import com.microsoft.commondatamodel.objectmodel.enums.CdmAttributeContextType;

/**
 * The description of a new attribute context into which a set of resolved attributes should be
 * placed.
 *
 * @deprecated This class is extremely likely to be removed in the public interface, and not meant
 * to be called externally at all. Please refrain from using it.
 *
 */
public class AttributeContextParameters {

  private String name;
  private boolean includeTraits;
  private CdmAttributeContext under;
  private CdmAttributeContextType type;
  private CdmObject regarding;

  public CdmObject getRegarding() {
    return regarding;
  }

  public void setRegarding(final CdmObject regarding) {
    this.regarding = regarding;
  }

  public boolean isIncludeTraits() {
    return includeTraits;
  }

  public void setIncludeTraits(final boolean includeTraits) {
    this.includeTraits = includeTraits;
  }

  public CdmAttributeContextType getType() {
    return type;
  }

  public void setType(final CdmAttributeContextType type) {
    this.type = type;
  }

  public String getName() {
    return name;
  }

  public void setName(final String name) {
    this.name = name;
  }

  public CdmAttributeContext getUnder() {
    return under;
  }

  public void setUnder(final CdmAttributeContext under) {
    this.under = under;
  }
}