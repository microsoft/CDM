package com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.OffsetDateTime;

/**
 * // TODO-BQ: Add link to CustomSerializer once implemented Represents the name and location of the
 * actual data files corresponding to the entity definition. If you make changes to this class,
 * please note a custom serializer is used CustomSerializer
 */
public class Partition extends DataObject {

  @JsonProperty("refreshTime")
  @JsonInclude(JsonInclude.Include.NON_NULL)
  private OffsetDateTime refreshTime;

  @JsonProperty("location")
  private String location;

  @JsonProperty("fileFormatSettings")
  private CsvFormatSettings fileFormatSettings;

  @JsonProperty("cdm:lastFileStatusCheckTime")
  @JsonInclude(JsonInclude.Include.NON_NULL)
  public OffsetDateTime lastFileStatusCheckTime;

  @JsonProperty("cdm:lastFileModifiedTime")
  @JsonInclude(JsonInclude.Include.NON_NULL)
  public OffsetDateTime lastFileModifiedTime;

  public void setFileFormatSettings(final CsvFormatSettings fileFormatSettings) {
    this.fileFormatSettings = fileFormatSettings;
  }

  public void setLastFileStatusCheckTime(final OffsetDateTime lastFileStatusCheckTime) {
    this.lastFileStatusCheckTime = lastFileStatusCheckTime;
  }

  public void setLocation(final String location) {
    this.location = location;
  }

  public OffsetDateTime getRefreshTime() {
    return refreshTime;
  }

  public CsvFormatSettings getFileFormatSettings() {
    return fileFormatSettings;
  }

  public void setLastFileModifiedTime(final OffsetDateTime lastFileModifiedTime) {
    this.lastFileModifiedTime = lastFileModifiedTime;
  }

  public OffsetDateTime getLastFileStatusCheckTime() {
    return lastFileStatusCheckTime;
  }

  public String getLocation() {
    return location;
  }

  public OffsetDateTime getLastFileModifiedTime() {
    return lastFileModifiedTime;
  }

  public void setRefreshTime(final OffsetDateTime refreshTime) {
    this.refreshTime = refreshTime;
  }
}
