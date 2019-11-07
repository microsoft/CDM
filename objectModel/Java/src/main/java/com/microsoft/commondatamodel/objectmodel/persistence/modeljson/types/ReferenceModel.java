package com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Represents an entity that belongs to an external model.
 */
public class ReferenceModel extends Model {

  @JsonProperty("id")
  private String id;

  @JsonProperty("location")
  private String location;

  public String getId() {
    return id;
  }

  public void setLocation(final String location) {
    this.location = location;
  }

  public void setId(final String id) {
    this.id = id;
  }

  public String getLocation() {
    return location;
  }
}
