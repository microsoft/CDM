// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;

/**
 * @deprecated This class is extremely likely to be removed in the public interface, and not meant
 * to be called externally at all. Please refrain from using it.
 */
@Deprecated
public class TimeUtils {

  /**
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @param date OffsetDateTime 
   * @return String
   */
  @Deprecated
  public static String formatDateStringIfNotNull(final OffsetDateTime date) {
    return date != null ? date.format(DateTimeFormatter.ISO_INSTANT)
        : null; // TODO-BQ: Verify the format is correctly conformed to C# standard, UtcDateTime.ToString("yyyy-MM-ddTHH:mm:ss.fffZ", CultureInfo.InvariantCulture)
  }

  /**
   * Returns the most recent time between the two input DateTimes
   * 
   * @deprecated This function is extremely likely to be removed in the public interface, and not meant
   * to be called externally at all. Please refrain from using it.
   * @param first OffsetDateTime
   * @param second OffsetDateTime
   * @return OffsetDateTime
   */
  @Deprecated
  public static OffsetDateTime maxTime(final OffsetDateTime first, final OffsetDateTime second) {
    if (first == null) {
      return second;
    }
    if (second == null) {
      return first;
    }

    return first.isAfter(second) ? first : second;
  }

}
