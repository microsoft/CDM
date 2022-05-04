# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional

from .entity_declaration_definition import EntityDeclarationDefinition
from .data_partition import DataPartition
from .data_partition_pattern import DataPartitionPattern


class LocalEntityDeclaration(EntityDeclarationDefinition):
    """The local entity declaration for CDM folders format."""

    def __init__(self):
        super().__init__('LocalEntity')

        self.dataPartitions = None  # type: List[DataPartition]
        """The data partitions"""

        self.dataPartitionPatterns = None  # type: List[DataPartitionPattern]
        """The data partition patterns."""

        self.incrementalPartitions = None  # type: List[DataPartition]
        """The incremental partitions"""

        self.incrementalPartitionPatterns = None  # type: List[DataPartitionPattern]
        """The incremental partition patterns."""

        self.entitySchema = None  # type: Optional[str]
        """The entity schema."""
