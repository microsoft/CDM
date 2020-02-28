// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import java.time.OffsetDateTime;

/**
 * An entity is a set of attributes and metadata that defines a concept like Account or Contact and
 * can be defined by any data producer.
 */

@JsonPropertyOrder({"$type"})
@JsonTypeInfo(
    visible = true,
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.EXISTING_PROPERTY,
    property = "$type",
    defaultImpl = LocalEntity.class)
@JsonSubTypes({
    @JsonSubTypes.Type(
        name = "LocalEntity",
        value = LocalEntity.class),
    @JsonSubTypes.Type(
        name = "ReferenceEntity",
        value = ReferenceEntity.class),
})
public abstract class Entity extends DataObject {
  @JsonProperty("$type")
  private String type;

  @JsonProperty("cdm:lastChildFileModifiedTime")
  @JsonInclude(JsonInclude.Include.NON_NULL)
  private OffsetDateTime lastChildFileModifiedTime;

  @JsonProperty("cdm:lastFileModifiedTime")
  @JsonInclude(JsonInclude.Include.NON_NULL)
  private OffsetDateTime lastFileModifiedTime;

  @JsonProperty("cdm:lastFileStatusCheckTime")
  @JsonInclude(JsonInclude.Include.NON_NULL)
  private OffsetDateTime lastFileStatusCheckTime;

  public OffsetDateTime getLastChildFileModifiedTime() {
    return lastChildFileModifiedTime;
  }

  public void setLastFileModifiedTime(final OffsetDateTime lastFileModifiedTime) {
    this.lastFileModifiedTime = lastFileModifiedTime;
  }

  public OffsetDateTime getLastFileStatusCheckTime() {
    return lastFileStatusCheckTime;
  }

  public OffsetDateTime getLastFileModifiedTime() {
    return lastFileModifiedTime;
  }

  public String getType() {
    return type;
  }

  public void setType(final String type) {
    this.type = type;
  }

  public void setLastFileStatusCheckTime(final OffsetDateTime lastFileStatusCheckTime) {
    this.lastFileStatusCheckTime = lastFileStatusCheckTime;
  }

  public void setLastChildFileModifiedTime(final OffsetDateTime lastChildFileModifiedTime) {
    this.lastChildFileModifiedTime = lastChildFileModifiedTime;
  }
}
