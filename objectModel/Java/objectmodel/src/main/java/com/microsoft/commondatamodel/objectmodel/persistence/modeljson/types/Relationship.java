package com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

/**
 * // TODO-BQ: Add link to CustomSerializer once implemented Describes how entities are connected.
 * If you make changes to this class, please note a custom serializer is used CustomSerializer You
 * can update file "test.extension.cdm.json" so that a test can confirm correct serialization.
 */
@JsonPropertyOrder({"$type"})
public class Relationship extends MetadataObject {

  @JsonProperty("$type")
  private String type;

  public void setType(final String type) {
    this.type = type;
  }

  public String getType() {
    return type;
  }
}
