// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System;
using System.Globalization;

namespace Microsoft.CommonDataModel.ObjectModel.Utilities
{
    internal static class TimeUtils
    {
        /// <summary>
        /// Converts a DateTime object to a ISO 8601 formatted string
        /// </summary>
        internal static string GetFormattedDateString(DateTimeOffset? date)
        {
            return date != null ? ((DateTimeOffset)date).UtcDateTime.ToString("yyyy-MM-ddTHH:mm:ss.fffZ", CultureInfo.InvariantCulture) : null;
        }

        /// <summary>
        /// Returns the most recent time between the two imput DateTimes
        /// </summary>
        internal static DateTimeOffset? MaxTime(DateTimeOffset? first, DateTimeOffset? second)
        {
            if (first == null)
                return second;
            if (second == null)
            {
                return first;
            }

            return first > second ? first : second;
        }
    }
}
