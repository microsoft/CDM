# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional


class CdmFileMetadata:
    def __init__(self) -> None:
        self.file_size_bytes = None  # type: Optional[int]
