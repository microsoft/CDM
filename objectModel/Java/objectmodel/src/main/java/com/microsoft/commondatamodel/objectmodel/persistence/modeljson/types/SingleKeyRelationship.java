// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * // TODO-BQ: Add link to CustomSerializer once implemented A relationship of with a single key to
 * a field. If you make changes to this class, please note a custom serializer is used
 * CustomSerializer
 */
public class SingleKeyRelationship extends Relationship {

  @JsonProperty("fromAttribute")
  private AttributeReference FromAttribute;

  @JsonProperty("toAttribute")
  private AttributeReference ToAttribute;

  public AttributeReference getToAttribute() {
    return ToAttribute;
  }

  public void setToAttribute(final AttributeReference ToAttribute) {
    this.ToAttribute = ToAttribute;
  }

  public AttributeReference getFromAttribute() {
    return FromAttribute;
  }

  public void setFromAttribute(final AttributeReference FromAttribute) {
    this.FromAttribute = FromAttribute;
  }
}
