// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * // TODO-BQ: Add link to CustomSerializer once implemented Represents a field within an entity. If
 * you make changes to this class, please note a custom serializer is used CustomSerializer
 */
public class Attribute extends DataObject {

  @JsonProperty("dataType")
  private String dataType;

  public String getDataType() {
    return dataType;
  }

  public void setDataType(final String dataType) {
    this.dataType = dataType;
  }
}
