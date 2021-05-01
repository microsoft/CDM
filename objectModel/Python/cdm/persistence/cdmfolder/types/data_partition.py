# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Union, Optional, List

from .trait_reference import TraitReference
from .trait_group_reference import TraitGroupReference
from .file_status import FileStatus


class DataPartition(FileStatus):
    def __init__(self):
        super().__init__()

        self.location = None  # type: Optional[str]
        """The corpus path for the data file location."""

        self.exhibitsTraits = None  # type: List[Union[str, TraitReference, TraitGroupReference]]
        """The exhibited traits."""

        self.arguments = None  # type: Optional[List[Argument]]
        """The list of key value pairs to give names for the replacement values from the RegEx."""

        self.specializedSchema = None  # type: Optional[str]
        """The path of a specialized schema to use specifically for the partitions generated."""
