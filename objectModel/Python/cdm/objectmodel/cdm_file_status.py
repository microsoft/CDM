# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from abc import ABC, abstractmethod
from datetime import datetime
from typing import Optional


class CdmFileStatus(ABC):
    # Last time the modified times were updated
    last_file_status_check_time = None  # type: Optional[datetime]

    # Last time this file was modified according to the OM
    last_file_modified_time = None  # type: Optional[datetime]

    # Last time the most recently modified child object was modified
    last_child_file_modified_time = None  # type: Optional[datetime]

    @abstractmethod
    async def file_status_check_async(self) -> None:
        """Check the modified time for this object and any children."""
        raise NotImplementedError()

    @abstractmethod
    async def report_most_recent_time_async(self, child_time: datetime) -> None:
        """Report most recent modified time (of current or children objects) to the parent object."""
        raise NotImplementedError()
