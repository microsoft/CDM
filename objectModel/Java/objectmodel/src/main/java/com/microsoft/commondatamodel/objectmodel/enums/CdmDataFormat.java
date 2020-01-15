package com.microsoft.commondatamodel.objectmodel.enums;

import java.util.Collections;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public enum CdmDataFormat {
  Int16,
  Int32,
  Int64,
  Float,
  Char,
  Double,
  String,
  Byte,
  Binary,
  DateTime,
  Date,
  Time,
  DateTimeOffset,
  Boolean,
  Decimal,
  Guid,
  Json,
  PK,
  Int,
  Unknown;

  private static final Map<String, CdmDataFormat> LOWERCASE_ENUM_MAP;

  static {
    final Map<String, CdmDataFormat> map = new ConcurrentHashMap<>();
    for (final CdmDataFormat value : CdmDataFormat.values()) {
      map.put(value.toString().toLowerCase(), value);
    }
    LOWERCASE_ENUM_MAP = Collections.unmodifiableMap(map);
  }

  public static CdmDataFormat fromString(final String baseType) {
    return LOWERCASE_ENUM_MAP.getOrDefault(baseType.toLowerCase(), Unknown);
  }
}