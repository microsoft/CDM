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

        self.folderName = ''  # type: str
        """The folder name."""

        self.explanation = ''  # type: str
        """The folder explanation."""

        self.exhibitsTraits = []  # type: List[Union[str, TraitReference]]
        """The exhibited traits."""

        self.entities = []  # type: List[Union[LocalEntityDeclaration, ReferencedEntityDeclaration]]
        """The entities(could only be LocalEntityDeclaration or ReferencedEntityDeclaration)."""

        self.subManifests = []  # type: List[ManifestDeclaration]
        """The sub folders."""

        self.relationships = []  # type: List[E2ERelationship]
        """The list of references that exist wherein either the fromEntity or the toEntity is defined in this folder."""
