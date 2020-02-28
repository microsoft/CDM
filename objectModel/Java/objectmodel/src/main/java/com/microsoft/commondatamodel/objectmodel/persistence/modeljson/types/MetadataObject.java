// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * // TODO-BQ: Add link to CustomSerializer once implemented Represents a base class for a metadata
 * object. If you make changes to this class, please note a custom serializer is used
 * CustomSerializer You can update file "test.extension.cdm.json" so that a test can confirm correct
 * serialization.
 */
public class MetadataObject {
  private transient Map<String, Object> extensionFields = new LinkedHashMap<>();

  @JsonProperty("name")
  @JsonInclude(JsonInclude.Include.NON_NULL)
  private String name;

  @JsonProperty("description")
  @JsonInclude(JsonInclude.Include.NON_NULL)
  private String description;

  @JsonProperty("annotations")
  @JsonInclude(JsonInclude.Include.NON_NULL)
  private List<Annotation> annotations;

  @JsonProperty("cdm:traits")
  @JsonInclude(JsonInclude.Include.NON_NULL)
  private List<JsonNode> traits;

  public String getName() {
    return this.name;
  }

  public List<Annotation> getAnnotations() {
    return this.annotations;
  }

  public void setDescription(final String description) {
    this.description = description;
  }

  public void setName(final String name) {
    this.name = name;
  }

  public List<JsonNode> getTraits() {
    return this.traits;
  }

  public String getDescription() {
    return description;
  }

  @JsonIgnore
  public void setOverrideExtensionFields(final Map<String, Object> extensionFields) {
    this.extensionFields = extensionFields;
  }

  @JsonAnySetter
  public void setExtensionFields(final String extensionFields, final Object value) {
    this.extensionFields.put(extensionFields, value);
  }

  public void setAnnotations(final List<Annotation> annotations) {
    this.annotations = annotations;
  }

  @JsonAnyGetter
  public Map<String, Object> getExtensionFields() {
    return this.extensionFields;
  }

  public void setTraits(final List<JsonNode> traits) {
    this.traits = traits;
  }
}
