# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from .file_status import FileStatus


class ManifestDeclaration(FileStatus):
    """The folder declaration for CDM folders format."""

    def __init__(self):
        super().__init__()

        self.explanation = None  # type: str
        """The explanation."""

        self.manifestName = None  # type: str
        """The manifest name."""

        self.definition = None  # type: str
        """The corpus path to the definition of the sub folder."""
