package com.microsoft.commondatamodel.objectmodel.utilities;

import java.util.Collections;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

enum CdmDataFormatTrait {
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