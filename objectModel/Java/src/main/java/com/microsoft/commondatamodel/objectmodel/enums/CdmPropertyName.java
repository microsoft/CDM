package com.microsoft.commondatamodel.objectmodel.enums;

/**
 * @deprecated This class is extremely likely to be removed in the public interface, and not
 * meant to be called externally at all. Please refrain from using it.
 */
@Deprecated
public enum CdmPropertyName {
  VERSION("version"),
  SOURCE_NAME("sourceName"),
  DISPLAY_NAME("displayName"),
  DESCRIPTION("description"),
  CDM_SCHEMAS("cdmSchemas"),
  SOURCE_ORDERING("sourceOrdering"),
  IS_PRIMARY_KEY("isPrimaryKey"),
  IS_NULLABLE("isNullable"),
  IS_READ_ONLY("isReadOnly"),
  VALUE_CONSTRAINED_TO_LIST("valueConstrainedToList"),
  MAXIMUM_VALUE("maximumValue"),
  MINIMUM_VALUE("minimumValue"),
  MAXIMUM_LENGTH("maximumLength"),
  DATA_FORMAT("dataFormat"),
  PRIMARY_KEY("primaryKey"),
  DEFAULT("defaultValue");

  private final String propertyName;

  CdmPropertyName(final String value) {
    this.propertyName = value;
  }

  @Override
  public String toString() {
    return this.propertyName;
  }
}
