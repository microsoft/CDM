
from typing import Optional

from .entity_declaration_definition import EntityDeclarationDefinition
from .data_partition import DataPartition
from .data_partition_pattern import DataPartitionPattern


class LocalEntityDeclaration(EntityDeclarationDefinition):
    """The local entity declaration for CDM folders format."""

    def __init__(self):
        super().__init__('LocalEntity')

        self.dataPartitions = []  # type: List[DataPartition]
        """The data partitions"""

        self.dataPartitionPatterns = []  # type: List[DataPartitionPattern]
        """The data partition patterns."""

        self.entitySchema = None  # type: Optional[str]
        """The entity schema."""
