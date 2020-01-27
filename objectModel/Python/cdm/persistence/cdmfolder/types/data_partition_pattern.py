from typing import Union, List

from .file_status import FileStatus
from .trait_reference import TraitReference


class DataPartitionPattern(FileStatus):
    """The representation of data partition pattern in the CDM Folders format."""

    def __init__(self):
        super().__init__()

        self.name = ''  # type: str
        """The name for the pattern."""

        self.explanation = ''  # type: str
        """The explanation for the pattern."""

        self.rootLocation = ''  # type: str
        """The starting location corpus path for searching for inferred data partitions."""

        self.regularExpression = ''  # type: str
        """The regular expression to use for searching partitions."""

        self.parameters = []  # type: List[str]
        """The names for replacement values from regular expression."""

        self.specializedSchema = ''  # type: str
        """The corpus path for specialized schema to use for matched pattern partitions."""

        self.exhibitsTraits = None  # type: Union[str, TraitReference]
        """The exhibited traits."""
