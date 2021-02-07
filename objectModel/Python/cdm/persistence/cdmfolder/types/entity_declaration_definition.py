# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import List, Union

from .file_status import FileStatus
from .trait_reference import TraitReference


class EntityDeclarationDefinition(FileStatus):
    """The local entity declaration for CDM folders format."""

    def __init__(self, path_type):
        super().__init__()

        self.type = path_type  # type: str
        """the entity declaration type."""

        self.entityName = None  # type: str
        """The entity name."""

        self.entityPath = None  # type: str
        """The entity path."""

        self.explanation = None  # type: str
        """The explanation."""

        self.exhibitsTraits = None  # type: List[Union[str, TraitReference]]
        """The exhibited traits."""
