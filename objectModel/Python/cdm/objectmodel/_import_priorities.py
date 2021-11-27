# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

class ImportPriorities:
    def __init__(self):
        self.import_priority = {}  # type: Dict[CdmDocumentDefinition, ImportInfo]
        self.moniker_priority_map = {}  # type: Dict[str, CdmDocumentDefinition]

        # True if one of the document's imports import this document back.
        # Ex.: A.cdm.json -> B.cdm.json -> A.cdm.json
        self.has_circular_import = False # type: bool

    def copy(self) -> 'ImportPriorities':
        copy = ImportPriorities()
        if self.import_priority:
            copy.import_priority = self.import_priority.copy()
        if self.moniker_priority_map:
            copy.moniker_priority_map = self.moniker_priority_map.copy()
        copy.has_circular_import = self.has_circular_import

        return copy
