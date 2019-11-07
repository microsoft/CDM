// Copyright (c) Microsoft Corporation.

package com.microsoft.commondatamodel.objectmodel.utilities;

/**
 * String utilities.
 */
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
    return str.substring(startIdx, endIdx - startIdx);
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
}