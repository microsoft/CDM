package com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.Import;
import java.time.OffsetDateTime;
import java.util.List;

/**
 * Represents the data in the CDM folder,
 * metadata and location, as well as how it was generated and by which data producer. If you make
 * changes to this class, please note a custom serializer is used CustomSerializer You can update
 * file "test.extension.cdm.json" so that a test can confirm correct serialization.
 */
public class Model extends DataObject {
  @JsonProperty("application")
  @JsonInclude(JsonInclude.Include.NON_NULL)
  private String application;

  @JsonProperty("version")
  @JsonInclude(JsonInclude.Include.NON_NULL)
  private String version;

  @JsonProperty("entities")
  private List<Entity> entities;

  @JsonProperty("relationships")
  @JsonInclude(JsonInclude.Include.NON_NULL)
  private List<SingleKeyRelationship> relationships;

  @JsonProperty("referenceModels")
  private List<ReferenceModel> referenceModels;

  @JsonProperty("culture")
  @JsonInclude(JsonInclude.Include.NON_NULL)
  private String culture;

  @JsonProperty("modifiedTime")
  @JsonInclude(JsonInclude.Include.NON_NULL)
  private OffsetDateTime modifiedTime;

  @JsonProperty("cdm:imports")
  @JsonInclude(JsonInclude.Include.NON_NULL)
  private List<Import> imports;

  @JsonProperty("cdm:lastFileStatusCheckTime")
  @JsonInclude(JsonInclude.Include.NON_NULL)
  private OffsetDateTime lastFileStatusCheckTime;

  @JsonProperty("cdm:lastChildFileModifiedTime")
  @JsonInclude(JsonInclude.Include.NON_NULL)
  private OffsetDateTime lastChildFileModifiedTime;

  public OffsetDateTime getLastFileStatusCheckTime() {
    return lastFileStatusCheckTime;
  }

  public OffsetDateTime getModifiedTime() {
    return modifiedTime;
  }

  public void setVersion(final String version) {
    this.version = version;
  }

  public void setLastFileStatusCheckTime(final OffsetDateTime LastFileStatusCheckTime) {
    this.lastFileStatusCheckTime = LastFileStatusCheckTime;
  }

  public void setRelationships(final List<SingleKeyRelationship> relationships) {
    this.relationships = relationships;
  }

  public List<Entity> getEntities() {
    return entities;
  }

  public String getVersion() {
    return version;
  }

  public void setEntities(final List<Entity> entities) {
    this.entities = entities;
  }

  public List<ReferenceModel> getReferenceModels() {
    return referenceModels;
  }

  public OffsetDateTime getLastChildFileModifiedTime() {
    return lastChildFileModifiedTime;
  }

  public void setLastChildFileModifiedTime(final OffsetDateTime LastChildFileModifiedTime) {
    this.lastChildFileModifiedTime = LastChildFileModifiedTime;
  }

  public void setModifiedTime(final OffsetDateTime modifiedTime) {
    this.modifiedTime = modifiedTime;
  }

  public String getCulture() {
    return culture;
  }

  public void setReferenceModels(final List<ReferenceModel> referenceModels) {
    this.referenceModels = referenceModels;
  }

  public String getApplication() {
    return application;
  }

  public void setCulture(final String culture) {
    this.culture = culture;
  }

  public List<Import> getImports() {
    return imports;
  }

  public void setImports(final List<Import> imports) {
    this.imports = imports;
  }

  public void setApplication(final String application) {
    this.application = application;
  }

  public List<SingleKeyRelationship> getRelationships() {
    return relationships;
  }
}
