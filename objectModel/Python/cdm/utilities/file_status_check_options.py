# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional


class FileStatusCheckOptions:
    def __init__(self) -> None:
        self.include_data_partition_size = None  # type: Optional[bool]
