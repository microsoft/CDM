from datetime import datetime, timezone
from typing import cast, Optional, TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.utilities import ResolveOptions, time_utils

from .cdm_entity_declaration_def import CdmEntityDeclarationDefinition
from .cdm_file_status import CdmFileStatus

if TYPE_CHECKING:
    from cdm.objectmodel import CdmAttributeContext, CdmCorpusContext, CdmCorpusDefinition, CdmObject
    from cdm.resolvedmodel import ResolvedAttributeSetBuilder, ResolvedTraitSetBuilder
    from cdm.utilities import FriendlyFormatNode, VisitCallback


class CdmReferencedEntityDeclarationDefinition(CdmEntityDeclarationDefinition):
    def __init__(self, ctx: 'CdmCorpusContext', name: str) -> None:
        super().__init__(ctx, name)

        self.last_child_file_modified_time = None  # type: Optional[datetime]

        self.last_file_modified_time = None  # type: Optional[datetime]

        self.last_file_status_check_time = None  # type: Optional[datetime]

    @property
    def data_partitions(self) -> Optional['CdmCollection[CdmDataPartitionDefinition]']:
        return None

    @property
    def data_partition_patterns(self) -> Optional['CdmCollection[CdmDataPartitionPatternDefinition]']:
        return None

    @property
    def object_type(self) -> 'CdmObjectType':
        return CdmObjectType.REFERENCED_ENTITY_DECLARATION_DEF

    def _construct_resolved_attributes(self, res_opt: 'ResolveOptions', under: Optional['CdmAttributeContext']) -> 'ResolvedAttributeSetBuilder':
        return None

    def _construct_resolved_traits(self, rtsb: 'ResolvedTraitSetBuilder', res_opt: 'ResolveOptions'):
        self._construct_resolved_traits_def(None, rtsb, res_opt)

    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmReferencedEntityDeclarationDefinition'] = None) -> 'CdmReferencedEntityDeclarationDefinition':
        if not res_opt:
            res_opt = ResolveOptions(wrt_doc=self)

        if not host:
            copy = CdmReferencedEntityDeclarationDefinition(self.ctx, self.entity_name)
        else:
            copy = host
            copy.ctx = self.ctx
            copy.entity_name = self.entity_name

        copy.entity_path = self.entity_path
        copy.last_file_status_check_time = self.last_file_status_check_time
        copy.last_file_modified_time = self.last_file_modified_time
        self._copy_def(res_opt, copy)
        return copy

    def validate(self) -> bool:
        return bool(self.entity_name and self.entity_path)

    def get_name(self) -> str:
        return self.entity_name

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        return False

    def is_derived_from(self, base: str, res_opt: Optional['ResolveOptions'] = None) -> bool:
        return False

    async def file_status_check_async(self) -> None:
        """Check the modified time for this object and any children."""
        full_path = self.ctx.corpus.storage.create_absolute_corpus_path(self.entity_path, self.in_document)

        modified_time = await cast('CdmCorpusDefinition', self.ctx.corpus)._compute_last_modified_time_async(full_path, self)

        self.last_file_status_check_time = datetime.now(timezone.utc)
        self.last_file_modified_time = time_utils.max_time(modified_time, self.last_file_modified_time)

        await self.report_most_recent_time_async(self.last_file_modified_time)

    async def report_most_recent_time_async(self, child_time: datetime) -> None:
        """Report most recent modified time (of current or children objects) to the parent object."""
        if isinstance(self.owner, CdmFileStatus) and child_time:
            await cast('CdmFileStatus', self.owner).report_most_recent_time_async(child_time)
