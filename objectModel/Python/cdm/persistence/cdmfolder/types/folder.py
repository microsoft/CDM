# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import List

from cdm.utilities import JObject

from .e2e_relationship import E2ERelationship
from .local_entity_declaration import LocalEntityDeclaration
from .manifest_declaration import ManifestDeclaration
from .referenced_entity_declaration import ReferencedEntityDeclaration
from .trait_reference import TraitReference


class Folder(JObject):
    def __init__(self):
        super().__init__()

        self.folderName = None  # type: str
        """The folder name."""

        self.explanation = None  # type: str
        """The folder explanation."""

        self.exhibitsTraits = None  # type: List[Union[str, TraitReference]]
        """The exhibited traits."""

        self.entities = None  # type: List[Union[LocalEntityDeclaration, ReferencedEntityDeclaration]]
        """The entities(could only be LocalEntityDeclaration or ReferencedEntityDeclaration)."""

        self.subManifests = None  # type: List[ManifestDeclaration]
        """The sub folders."""

        self.relationships = None  # type: List[E2ERelationship]
        """The list of references that exist wherein either the fromEntity or the toEntity is defined in this folder."""
