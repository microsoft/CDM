// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

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
@Deprecated
public class AttributeContextParameters {

  private String name;
  private boolean includeTraits;
  private CdmAttributeContext under;
  private CdmAttributeContextType type;
  private CdmObject regarding;

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @return AttributeContextParameters
   */
  @Deprecated
  public AttributeContextParameters copy() {
    AttributeContextParameters c = new AttributeContextParameters();
    c.setName(this.name);
    c.setIncludeTraits(this.includeTraits);
    c.setUnder(this.under);
    c.setType(this.type);
    c.setRegarding(this.regarding);
    return c;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @return CdmObject
   */
  @Deprecated
  public CdmObject getRegarding() {
    return regarding;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @param regarding CdmObject
   */
  @Deprecated
  public void setRegarding(final CdmObject regarding) {
    this.regarding = regarding;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @return boolean
   */
  @Deprecated
  public boolean isIncludeTraits() {
    return includeTraits;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @param includeTraits boolean
   */
  @Deprecated
  public void setIncludeTraits(final boolean includeTraits) {
    this.includeTraits = includeTraits;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @return CdmAttributeContextType
   */
  @Deprecated
  public CdmAttributeContextType getType() {
    return type;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @param type CdmAttributeContextType
   */
  @Deprecated
  public void setType(final CdmAttributeContextType type) {
    this.type = type;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @return String
   */
  @Deprecated
  public String getName() {
    return name;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @param name String
   */
  @Deprecated
  public void setName(final String name) {
    this.name = name;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @return CdmAttributeContext
   */
  @Deprecated
  public CdmAttributeContext getUnder() {
    return under;
  }

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @param under CdmAttributeContext 
   */
  @Deprecated
  public void setUnder(final CdmAttributeContext under) {
    this.under = under;
  }
}
