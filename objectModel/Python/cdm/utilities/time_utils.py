# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

from datetime import datetime, timezone
from typing import Optional


def get_formatted_date_string(date: datetime) -> Optional[str]:
    if not date:
        return None

    # Convert to UTC datetime only if the date is 'aware'.
    if date.tzinfo and date.utcoffset():
        date = date.astimezone(timezone.utc)

    # Print in Microsoft's ISO 8601 format.
    return (date.replace(tzinfo=None).isoformat() + '.000')[:23] + 'Z'


def max_time(first: datetime, second: datetime) -> datetime:
    if not first or not second:
        return first or second
    return max(first, second)
