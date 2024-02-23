# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from datetime import datetime

class CdmFileMetadata:
    def __init__(self) -> None:
        self.file_size_bytes = None  # type: Optional[int]

        self.last_modified_time = None  # type: Optional[datetime]
