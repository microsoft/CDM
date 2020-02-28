// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.enums;

/**
 * @deprecated This class is extremely likely to be removed in the public interface, and not
 * meant to be called externally at all. Please refrain from using it.
 */
@Deprecated
public enum CdmPropertyName {
  CDM_SCHEMAS("cdmSchemas"),
  DATA_FORMAT("dataFormat"),
  DEFAULT("defaultValue"),
  DESCRIPTION("description"),
  DISPLAY_NAME("displayName"),
  IS_NULLABLE("isNullable"),
  IS_PRIMARY_KEY("isPrimaryKey"),
  IS_READ_ONLY("isReadOnly"),
  MAXIMUM_LENGTH("maximumLength"),
  MAXIMUM_VALUE("maximumValue"),
  MINIMUM_VALUE("minimumValue"),
  PRIMARY_KEY("primaryKey"),
  SOURCE_NAME("sourceName"),
  SOURCE_ORDERING("sourceOrdering"),
  VALUE_CONSTRAINED_TO_LIST("valueConstrainedToList"),
  VERSION("version");

  private final String propertyName;

  CdmPropertyName(final String value) {
    this.propertyName = value;
  }

  @Override
  public String toString() {
    return this.propertyName;
  }
}
