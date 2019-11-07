package com.microsoft.commondatamodel.objectmodel.utilities;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;

/**
 * @deprecated This class is extremely likely to be removed in the public interface, and not meant
 * to be called externally at all. Please refrain from using it.
 */
public class TimeUtils {

  public static String formatDateStringIfNotNull(final OffsetDateTime date) {
    return date != null ? date.format(DateTimeFormatter.ISO_INSTANT)
        : null; // TODO-BQ: Verify the format is correctly conformed to C# standard, UtcDateTime.ToString("yyyy-MM-ddTHH:mm:ss.fffZ", CultureInfo.InvariantCulture)
  }

  /// <summary>
  /// Returns the most recent time between the two input DateTimes
  /// </summary>
  // TODO-BQ: Change it to a more descriptive name for the function. Suggestion, mostRecentTime.
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
