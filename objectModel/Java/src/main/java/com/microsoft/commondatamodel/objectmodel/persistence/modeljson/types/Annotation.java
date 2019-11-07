package com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Non essential contextual information (key/value pairs) that can be used to store additional
 * context about a properties in the model file. Annotations can be applied at multiple levels
 * including to entities and attributes. Producers can add a prefix, such as
 * “contonso.com:MappingDisplayHint” where “contonso.com:” is the prefix, when annotations are not
 * necessarily relevant to other consumers.
 */
public class Annotation {

  @JsonProperty("name")
  private String name;

  @JsonProperty("value")
  private String value;

  public String getValue() {
    return value;
  }

  public void setValue(final String value) {
    this.value = value;
  }

  public String getName() {
    return name;
  }

  public void setName(final String name) {
    this.name = name;
  }
}