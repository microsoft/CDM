// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities;

import java.util.Collections;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @deprecated This class is extremely likely to be removed in the public interface, and not
 * meant to be called externally at all. Please refrain from using it.
 */
@Deprecated
public enum CdmDataFormatTrait {
  IDENTIFIED_BY("is.identifiedBy"),
  DATA_FORMAT("is.dataFormat"),
  INTEGER("is.dataFormat.integer"),
  NUMERIC_SHAPED("is.dataFormat.numeric.shaped"),
  BOOLEAN("is.dataFormat.boolean"),
  SMALL("is.dataFormat.small"),
  BIG("is.dataFormat.big"),
  FLOATING_POINT("is.dataFormat.floatingPoint"),
  CHARACTER("is.dataFormat.character"),
  ARRAY("is.dataFormat.array"),
  GUID("is.dataFormat.guid"),
  BYTE("is.dataFormat.byte"),
  TIME("is.dataFormat.time"),
  DATE("is.dataFormat.date"),
  DATETIME_OFFSET("is.dataFormat.timeOffset"),
  JSON("means.content.text.JSON"),
  DEFAULT("default");

  private final String dataformat;
  private static final Map<String, CdmDataFormatTrait> ENUM_MAP;

  CdmDataFormatTrait(final String value) {
    this.dataformat = value;
  }

  static {
    final Map<String, CdmDataFormatTrait> map = new ConcurrentHashMap<>();
    for (final CdmDataFormatTrait value : CdmDataFormatTrait.values()) {
      map.put(value.toString(), value);
    }
    ENUM_MAP = Collections.unmodifiableMap(map);
  }

  @Override
  public String toString() {
    return this.dataformat;
  }

  public static CdmDataFormatTrait fromString(final String value) {
    return ENUM_MAP.getOrDefault(value, DEFAULT);
  }
}
