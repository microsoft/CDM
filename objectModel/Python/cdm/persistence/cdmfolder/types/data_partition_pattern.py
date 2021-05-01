# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Union, List, Optional

from .file_status import FileStatus
from .trait_reference import TraitReference
from .trait_group_reference import TraitGroupReference


class DataPartitionPattern(FileStatus):
    """The representation of data partition pattern in the CDM Folders format."""

    def __init__(self):
        super().__init__()

        self.name = None  # type: str
        """The name for the pattern."""

        self.explanation = None  # type: str
        """The explanation for the pattern."""

        self.rootLocation = None  # type: str
        """The starting location corpus path for searching for inferred data partitions."""

        self.globPattern = None  # type: str
        """The glob pattern to use for searching partitions."""

        self.regularExpression = None  # type: str
        """The regular expression to use for searching partitions."""

        self.parameters = None  # type: List[str]
        """The names for replacement values from regular expression."""

        self.specializedSchema = None  # type: str
        """The corpus path for specialized schema to use for matched pattern partitions."""

        self.exhibitsTraits = None  # type: List[Union[str, TraitReference, TraitGroupReference]]
        """The exhibited traits."""
