# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import List

from .document_content import DocumentContent
from .entity_declaration_definition import EntityDeclarationDefinition
from .file_status import FileStatus
from .manifest_declaration import ManifestDeclaration
from .trait_reference import TraitReference


class ManifestContent(DocumentContent, FileStatus):
    def __init__(self):
        super().__init__()

        self.manifestName = ''  # type: str
        self.explanation = ''  # type: str
        self.exhibitsTraits = []  # type: List[TraitReference]
        self.subManifests = []  # type: List[ManifestDeclaration]
        self.entities = []  # type: List[EntityDeclarationDefinition]
