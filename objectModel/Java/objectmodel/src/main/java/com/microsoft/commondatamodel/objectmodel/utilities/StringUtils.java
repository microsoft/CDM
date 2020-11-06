// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities;

/**
 * String utilities.
 * 
 * @deprecated This class is extremely likely to be removed in the public interface, and not meant
 * to be called externally at all. Please refrain from using it.
 */
@Deprecated
public class StringUtils {

  /**
   * Returns part of the string between the two indexes.
   *
   * @param str String to slice
   * @param startIdx Start index
   * @param endIdx End index
   * @return sliced string
   */
  public static String slice(final String str, final int startIdx, final int endIdx) {
    return str.substring(startIdx, endIdx);
  }

  /**
   * Returns part of the string from the start index until the end.
   *
   * @param str String to slice
   * @param startIdx Start index
   * @return sliced string
   */
  public static String slice(final String str, final int startIdx) {
    return str.substring(startIdx);
  }

  /**
   * Returns true if the string is null or empty when trimmed (zero length).
   *
   * @param str String to check
   *
   * @return {@code true} if the string is null or empty when trimmed, {@code false} otherwise.
   */
  public static boolean isNullOrTrimEmpty(final String str) {
    return str == null || str.trim().isEmpty();
  }

  /**
   * Returns true if the string is null or empty ("").
   *
   * @param str String to check
   *
   * @return {@code true} if the string is null or empty (""), {@code false} otherwise.
   */
  public static boolean isNullOrEmpty(final String str) {
    return str == null || str.isEmpty();
  }

  /**
   * Capitalizes first letter of the given string.
   * @param str String to capitalize
   * @return Capitalized string
   */
  public static String capitalize(final String str) {
    if (str == null || isNullOrEmpty(str))
      return str;

    if (str.length() == 1)
      return str.substring(0, 1).toUpperCase();
    else
      return str.substring(0, 1).toUpperCase() + str.substring(1);
  }

  public static boolean equalsWithIgnoreCase(final String strA, final String strB) {
    return strA.equalsIgnoreCase(strB);
  }

  public static boolean equalsWithCase(final String strA, final String strB) {
    return strA.equals(strB);
  }

  /**
   * Replaces in the pattern in the source with the value
   * @param source The source string
   * @param pattern A pattern in the format {p}. The code will try to find {p} and {P}
   * @param value The value to be replaced instead of the pattern
   * @return string
   */
  public static String replace(String source, char pattern, String value) {
    if (value == null) {
      value = "";
    }

    char lowerCasePattern = Character.toLowerCase(pattern);
    char upperCasePattern = Character.toUpperCase(pattern);
    String upperCaseValue = "";
    
    if (!isNullOrEmpty(value)) {
        upperCaseValue = capitalize(value);
    }

    String result = source.replace("{" + lowerCasePattern + "}", value);
    return result.replace("{" + upperCasePattern + "}", upperCaseValue);
  }
}
