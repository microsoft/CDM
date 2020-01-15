package com.microsoft.commondatamodel.objectmodel.utilities;

import java.util.Map;

/**
 * @deprecated This class is extremely likely to be removed in the public interface, and not meant
 * to be called externally at all. Please refrain from using it.
 */
public class DynamicObjectExtensions {
  public static boolean hasProperty(final Object obj, final String propertyName) {
    // TODO-BQ: 8/14/2019 Revisit this method, the concept of ExpandoObject doesn't exist in Java.
    if (obj instanceof Map) {
      return ((Map) obj).containsKey(propertyName);
    }

    try {
      obj.getClass().getField(propertyName);
      return true;
    } catch (final NoSuchFieldException e) {
      return false;
    }
  }
}
