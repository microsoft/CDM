from datetime import datetime
from typing import cast, Dict, List, Optional, TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.utilities import FriendlyFormatNode, ResolveOptions, time_utils, TraitToPropertyMap

from .cdm_file_status import CdmFileStatus
from .cdm_object_def import CdmObjectDefinition

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmCorpusDefinition
    from cdm.utilities import VisitCallback


class CdmDataPartitionDefinition(CdmObjectDefinition, CdmFileStatus):
    def __init__(self, ctx: 'CdmCorpusContext', name: str) -> None:
        super().__init__(ctx)

        # The name of a data partition.
        self.data_partition_name = name  # type: str

        # The corpus path for the data file location.
        self.location = None  # type: Optional[str]

        # Indicates whether this partition is inferred.
        self.inferred = False  # type: bool

        # The list of key value pairs to give names for the replacement values from the RegEx.
        self.arguments = {}  # type: Dict[str, List[str]]

        # The path of a specialized schema to use specifically for the partitions generated.
        self.specialized_schema = None  # type: Optional[str]

        # The refresh time of the partition.
        self.refresh_time = None  # type: Optional[datetime]

        self.last_child_file_modified_time = None  # type: Optional[datetime]

        self.last_file_modified_time = None  # type: Optional[datetime]

        self.last_file_status_check_time = None  # type: Optional[datetime]

        # --- Internal ---

        self._ttpm = TraitToPropertyMap(self)

    @property
    def object_type(self) -> 'CdmObjectType':
        return CdmObjectType.DATA_PARTITION_DEF

    @property
    def description(self) -> str:
        return cast(str, self._ttpm.fetch_property_value('description'))

    @description.setter
    def description(self, val: str) -> None:
        self._ttpm.update_property_value('description', val)

    def copy(self, res_opt: Optional['ResolveOptions'] = None) -> 'CdmDataPartitionDefinition':
        res_opt = res_opt if res_opt is not None else ResolveOptions(wrt_doc=self)

        copy = CdmDataPartitionDefinition(self.ctx, self.data_partition_name)

        copy.location = self.location
        copy.last_file_status_check_time = self.last_file_status_check_time
        copy.last_file_modified_time = self.last_file_modified_time
        copy.inferred = self.inferred
        copy.arguments = self.arguments
        copy.specialized_schema = self.specialized_schema
        self._copy_def(res_opt, copy)

        return copy

    async def file_status_check_async(self) -> None:
        """Check the modified time for this object and any children."""
        namespace = self.in_document.namespace
        full_path = self.location if ':' in self.location else (namespace + ':' + self.location)
        modified_time = await (cast('CdmCorpusDefinition', self.ctx.corpus))._fetch_last_modified_time_from_partition_path_async(full_path)
        # Update modified times.
        self.last_file_modified_time = time_utils.max_time(modified_time, self.last_file_modified_time)
        await self.report_most_recent_time_async(self.last_file_modified_time)

    def get_name(self) -> str:
        return self.data_partition_name

    def is_derived_from(self, base: str, res_opt: Optional['ResolveOptions'] = None) -> bool:
        return False

    async def report_most_recent_time_async(self, child_time: datetime) -> None:
        """Report most recent modified time (of current or children objects) to the parent object."""
        if cast(CdmFileStatus, self.owner).report_most_recent_time_async and child_time:
            await cast(CdmFileStatus, self.owner).report_most_recent_time_async(child_time)

    def validate(self) -> bool:
        return bool(self.data_partition_name)

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        return False
