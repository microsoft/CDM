# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from datetime import datetime, timezone
from typing import Optional


def _get_formatted_date_string(date: datetime) -> Optional[str]:
    if not date:
        return None

    # Convert to UTC datetime only if the date is 'aware'.
    if date.tzinfo and date.utcoffset():
        date = date.astimezone(timezone.utc)

    # Print in Microsoft's ISO 8601 format.
    return (date.replace(tzinfo=None).isoformat() + '.000')[:23] + 'Z'


def _max_time(first: Optional[datetime], second: Optional[datetime]) -> Optional[datetime]:
    if not first or not second:
        return first or second
    return max(first, second)
