package com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * CSV file format settings.
 */
public class CsvFormatSettings extends FileFormatSettings {

  @JsonProperty("columnHeaders")
  @JsonInclude(JsonInclude.Include.NON_NULL)
  private Boolean columnHeaders;

  @JsonProperty("csvStyle")
  @JsonInclude(JsonInclude.Include.NON_NULL)
  private String csvStyle;

  @JsonProperty("delimiter")
  @JsonInclude(JsonInclude.Include.NON_NULL)
  private String delimiter;

  @JsonProperty("quoteStyle")
  @JsonInclude(JsonInclude.Include.NON_NULL)
  private String quoteStyle;

  @JsonProperty("encoding")
  @JsonInclude(JsonInclude.Include.NON_NULL)
  private String encoding;

  public String getCsvStyle() {
    return csvStyle;
  }

  public void setColumnHeaders(final Boolean columnHeaders) {
    this.columnHeaders = columnHeaders;
  }

  public Boolean isColumnHeaders() {
    return columnHeaders;
  }

  public String getQuoteStyle() {
    return quoteStyle;
  }

  public void setQuoteStyle(final String quoteStyle) {
    this.quoteStyle = quoteStyle;
  }

  public void setDelimiter(final String delimiter) {
    this.delimiter = delimiter;
  }

  public String getDelimiter() {
    return delimiter;
  }

  public void setCsvStyle(final String csvStyle) {
    this.csvStyle = csvStyle;
  }

  public void setEncoding(final String encoding) {
    this.encoding = encoding;
  }

  public String getEncoding() {
    return encoding;
  }
}