// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * // TODO-BQ: Add link to CustomSerializer once implemented Defines a base class for a data object.
 * If you make changes to this class, please note a custom serializer is used CustomSerializer You
 * can update file "test.extension.cdm.json" so that a test can confirm correct serialization.
 */
public class DataObject extends MetadataObject {

  @JsonProperty("isHidden")
  @JsonInclude(JsonInclude.Include.NON_NULL)
  private Boolean hidden;

  public Boolean isHidden() {
    return this.hidden;
  }

  public void setHidden(final Boolean hidden) {
    this.hidden = hidden;
  }
}
