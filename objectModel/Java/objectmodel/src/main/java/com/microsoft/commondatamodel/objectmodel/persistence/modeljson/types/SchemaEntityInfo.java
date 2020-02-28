// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * CdmEntityDefinition information stored in a schema.
 */
public class SchemaEntityInfo {

  @JsonProperty("entityName")
  private String entityName;

  @JsonProperty("entityVersion")
  private String entityVersion;

  @JsonProperty("entityNamespace")
  private String entityNamespace;

  public String getEntityNamespace() {
    return entityNamespace;
  }

  public String getEntityVersion() {
    return entityVersion;
  }

  public String getEntityName() {
    return entityName;
  }

  public void setEntityName(final String entityName) {
    this.entityName = entityName;
  }

  public void setEntityNamespace(final String entityNamespace) {
    this.entityNamespace = entityNamespace;
  }

  public void setEntityVersion(final String entityVersion) {
    this.entityVersion = entityVersion;
  }
}
