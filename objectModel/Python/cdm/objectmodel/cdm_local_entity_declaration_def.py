from datetime import datetime, timezone
from typing import cast, Dict, List, Optional, TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.utilities import ResolveOptions, time_utils

from .cdm_collection import CdmCollection
from .cdm_entity_declaration_def import CdmEntityDeclarationDefinition

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCollection, CdmCorpusContext, CdmCorpusDefinition, CdmDataPartitionDefinition, \
        CdmDataPartitionPatternDefinition, CdmFileStatus
    from cdm.utilities import FriendlyFormatNode, VisitCallback

    from .cdm_trait_collection import CdmTraitCollection


class CdmLocalEntityDeclarationDefinition(CdmEntityDeclarationDefinition):
    def __init__(self, ctx: 'CdmCorpusContext', name: str) -> None:
        super().__init__(ctx, name)

        self.last_child_file_modified_time = None  # type: Optional[datetime]

        self.last_file_modified_time = None  # type: Optional[datetime]

        self.last_file_status_check_time = None  # type: Optional[datetime]

        # Internal
        self._data_partitions = CdmCollection(self.ctx, self, CdmObjectType.DATA_PARTITION_DEF)
        self._data_partition_patterns = CdmCollection(self.ctx, self, CdmObjectType.DATA_PARTITION_PATTERN_DEF)

    @property
    def object_type(self) -> 'CdmObjectType':
        return CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF

    @property
    def data_partitions(self) -> 'CdmCollection[CdmDataPartitionDefinition]':
        return self._data_partitions

    @property
    def data_partition_patterns(self) -> 'CdmCollection[CdmDataPartitionPatternDefinition]':
        return self._data_partition_patterns

    def _create_partition_from_pattern(self, file_path: str, exhibits_traits: 'CdmTraitCollection',
                                       args: Dict[str, List[str]], schema: str, modified_time: datetime) -> None:
        """Create a data partition object using the input, should be called by DataPartitionPattern object."""
        existing_partition = next((x for x in self.data_partitions if x.location == file_path), None)

        if not existing_partition:
            new_partition = self.ctx.corpus.make_object(CdmObjectType.DATA_PARTITION_DEF)
            new_partition.location = file_path
            new_partition.specialized_schema = schema
            new_partition.last_file_modified_time = modified_time
            new_partition.last_file_status_check_time = datetime.now(timezone.utc)

            for trait in exhibits_traits:
                new_partition.exhibits_traits.append(trait)

            new_partition.arguments = args.copy()
            self.data_partitions.append(new_partition)

    async def file_status_check_async(self) -> None:
        """Check the modified time for this object and any children."""
        modified_time = await cast('CdmCorpusDefinition', self.ctx.corpus)._fetch_last_modified_time_async(self.entity_path)

        for partition in self.data_partitions:
            await partition.file_status_check_async()

        for pattern in self.data_partition_patterns:
            await pattern.file_status_check_async()

        self.last_file_status_check_time = datetime.now(timezone.utc)
        self.last_file_modified_time = time_utils.max_time(modified_time, self.last_file_modified_time)

        await self.report_most_recent_time_async(self.last_file_modified_time)

    def get_name(self) -> str:
        return self.entity_name

    def is_derived_from(self, base: str, res_opt: Optional['ResolveOptions'] = None) -> bool:
        return False

    def copy(self, res_opt: Optional['ResolveOptions'] = None) -> 'CdmLocalEntityDeclarationDefinition':
        res_opt = res_opt if res_opt is not None else ResolveOptions(wrt_doc=self)

        copy = CdmLocalEntityDeclarationDefinition(self.ctx, self.entity_name)
        copy.entity_path = self.entity_path
        copy.last_file_status_check_time = self.last_file_status_check_time
        copy.last_file_modified_time = self.last_file_modified_time
        copy.last_child_file_modified_time = self.last_child_file_modified_time

        for partition in self.data_partitions:
            copy.data_partitions.append(partition)

        for pattern in self.data_partition_patterns:
            copy.data_partition_patterns.append(pattern)

        self._copy_def(res_opt, copy)

        return copy

    async def report_most_recent_time_async(self, child_time: datetime) -> None:
        """Report most recent modified time (of current or children objects) to the parent object."""
        self.last_child_file_modified_time = child_time
        most_recent_at_this_level = time_utils.max_time(child_time, self.last_file_modified_time)

        if cast('CdmFileStatus', self.owner).report_most_recent_time_async and most_recent_at_this_level:
            await cast('CdmFileStatus', self.owner).report_most_recent_time_async(most_recent_at_this_level)

    def validate(self) -> bool:
        return bool(self.entity_name)

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        path = self._declared_path
        if not path:
            path = '{}{}'.format(path_from, self.entity_name)
            self._declared_path = path

        if pre_children and pre_children(self, path):
            return False

        if self.data_partitions and self.data_partitions._visit_array('{}/'.format(path), pre_children, post_children):
            return True

        return False
