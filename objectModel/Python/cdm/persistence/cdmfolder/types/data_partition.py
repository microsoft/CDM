# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Union, Tuple

from .trait_reference import TraitReference
from .file_status import FileStatus


class DataPartition(FileStatus):
    def __init__(self):
        super().__init__()

        self.location = ''  # type: str
        """The corpus path for the data file location."""

        self.exhibitsTraits = None  # type: Union[str, TraitReference]
        """The exhibited traits."""

        self.arguments = None  # type: Tuple[str, str]
        """The list of key value pairs to give names for the replacement values from the RegEx."""

        self.specializedSchema = ''  # type: str
        """The path of a specialized schema to use specifically for the partitions generated."""
