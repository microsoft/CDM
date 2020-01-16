package com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

/**
 * Represents a base class for file format settings.
 */
@JsonPropertyOrder({"$type"})
public class FileFormatSettings {

  @JsonProperty("$type")
  @JsonInclude(JsonInclude.Include.NON_NULL)
  private String type;

  public void setType(final String type) {
    this.type = type;
  }

  public String getType() {
    return type;
  }
}