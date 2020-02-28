// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AttributeReference {

  @JsonProperty("entityName")
  private String entityName;

  @JsonProperty("attributeName")
  private String attributeName;

  public String getEntityName() {
    return entityName;
  }

  public void setEntityName(final String entityName) {
    this.entityName = entityName;
  }

  public void setAttributeName(final String attributeName) {
    this.attributeName = attributeName;
  }

  public String getAttributeName() {
    return attributeName;
  }
}
