package com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * // TODO-BQ: Add link to CustomSerializer once implemented Represents a model that contains source
 * to an external model. If you make changes to this class, please note a custom serializer is used
 * CustomSerializer
 */
public class ReferenceEntity extends Entity {

  @JsonProperty("source")
  private String source;

  @JsonProperty("modelId")
  private String modelId;

  public String getSource() {
    return source;
  }

  public void setModelId(final String modelId) {
    this.modelId = modelId;
  }

  public String getModelId() {
    return modelId;
  }

  public void setSource(final String source) {
    this.source = source;
  }
}
