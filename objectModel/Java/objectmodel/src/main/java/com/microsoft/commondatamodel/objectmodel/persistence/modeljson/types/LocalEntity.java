// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.Import;
import java.util.List;

/**
 * Represents an entity that belongs to the current model.
 */
public class LocalEntity extends Entity {

  @JsonProperty("attributes")
  private List<Attribute> attributes;

  @JsonProperty("partitions")
  @JsonInclude(JsonInclude.Include.NON_NULL)
  private List<Partition> partitions;

  @JsonProperty("schemas")
  @JsonInclude(JsonInclude.Include.NON_NULL)
  private List<String> Schemas;

  @JsonProperty("cdm:imports")
  @JsonInclude(JsonInclude.Include.NON_NULL)
  public List<Import> imports;

  public void setAttributes(final List<Attribute> attributes) {
    this.attributes = attributes;
  }

  public void setSchemas(final List<String> Schemas) {
    this.Schemas = Schemas;
  }

  public List<Attribute> getAttributes() {
    return attributes;
  }

  public List<Partition> getPartitions() {
    return partitions;
  }

  public List<String> getSchemas() {
    return Schemas;
  }

  public void setPartitions(final List<Partition> partitions) {
    this.partitions = partitions;
  }

  public List<Import> getImports() {
    return imports;
  }

  public void setImports(final List<Import> imports) {
    this.imports = imports;
  }
}
