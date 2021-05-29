// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import java.util.List;

/**
 * used to indicate that this attribute select either 'one' or 'all' of the sub-attributes from an entity. If the 'structured' directive is set, this trait causes resolved attributes to end up in groups rather than a flattend list.
 * @deprecated
 * Resolution guidance is being deprecated in favor of Projections. https://docs.microsoft.com/en-us/common-data-model/sdk/convert-logical-entities-resolved-entities#projection-overview
 */
public class SelectsSubAttribute {
  private String selects;
  private CdmTypeAttributeDefinition selectedTypeAttribute;
  private List<String> selectsSomeTakeNames;
  private List<String> selectsSomeAvoidNames;

  /**
   * @return used to indicate either 'one' or 'all' sub-attributes selected.
   */
  public String getSelects() {
    return this.selects;
  }

  /**
   * @param value used to indicate either 'one' or 'all' sub-attributes selected.
   */
  public void setSelects(final String value) {
    this.selects = value;
  }

  /**
   * @return The supplied attribute definition will be added to the Entity to hold a description of the single attribute that was selected from the sub-entity when selects is 'one'
   */
  public CdmTypeAttributeDefinition getSelectedTypeAttribute() {
    return this.selectedTypeAttribute;
  }

  /**
   * @param value The supplied attribute definition will be added to the Entity to hold a description of the single attribute that was selected from the sub-entity when selects is 'one'
   */
  public void setSelectedTypeAttribute(final CdmTypeAttributeDefinition value) {
    this.selectedTypeAttribute = value;
  }

  public List<String> getSelectsSomeTakeNames() {
    return selectsSomeTakeNames;
  }

  public void setSelectsSomeTakeNames(List<String> selectsSomeTakeNames) {
    this.selectsSomeTakeNames = selectsSomeTakeNames;
  }

  public List<String> getSelectsSomeAvoidNames() {
    return selectsSomeAvoidNames;
  }

  public void setSelectsSomeAvoidNames(List<String> selectsSomeAvoidNames) {
    this.selectsSomeAvoidNames = selectsSomeAvoidNames;
  }
}
