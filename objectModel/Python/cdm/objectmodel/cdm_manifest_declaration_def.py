from datetime import datetime, timezone
from typing import cast, Optional, TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.utilities import ResolveOptions, time_utils

from .cdm_file_status import CdmFileStatus
from .cdm_object_def import CdmObjectDefinition

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmCorpusDefinition, CdmObjectReference
    from cdm.utilities import FriendlyFormatNode, VisitCallback


class CdmManifestDeclarationDefinition(CdmObjectDefinition, CdmFileStatus):
    def __init__(self, ctx: 'CdmCorpusContext', name: str) -> None:
        super().__init__(ctx)

        # The name of the manifest declared.
        self.manifest_name = name  # type: str

        # The corpus path to the definition of the sub folder.
        self.definition = None  # type: Optional[str]

    @property
    def object_type(self) -> 'CdmObjectType':
        return CdmObjectType.MANIFEST_DECLARATION_DEF

    def _construct_resolved_attributes(self, res_opt: 'ResolveOptions', under: Optional['CdmAttributeContext']) -> 'ResolvedAttributeSetBuilder':
        return None

    def _construct_resolved_traits(self, rtsb: 'ResolvedTraitSetBuilder', res_opt: 'ResolveOptions') -> None:
        pass

    def copy(self, res_opt: Optional['ResolveOptions'] = None) -> 'CdmManifestDeclarationDefinition':
        res_opt = res_opt if res_opt is not None else ResolveOptions(wrt_doc=self)

        copy = CdmManifestDeclarationDefinition(self.ctx, self.manifest_name)
        copy.definition = self.definition
        copy.last_file_status_check_time = self.last_file_status_check_time
        copy.last_file_modified_time = self.last_file_modified_time
        self._copy_def(res_opt, copy)

        return copy

    async def file_status_check_async(self) -> None:
        """Check the modified time for this object and any children."""
        manifest_path = self._fetch_manifest_path()
        modified_time = await cast('CdmCorpusDefinition', self.ctx.corpus)._fetch_last_modified_time_async(manifest_path)

        self.last_file_status_check_time = datetime.now(timezone.utc)
        self.last_file_modified_time = time_utils.max_time(modified_time, self.last_file_modified_time)

        await self.report_most_recent_time_async(self.last_file_modified_time)

    def get_name(self) -> str:
        return self.manifest_name

    def is_derived_from(self, base: str, res_opt: Optional['ResolveOptions'] = None) -> bool:
        return False

    async def report_most_recent_time_async(self, child_time: datetime) -> None:
        """Report most recent modified time (of current or children objects) to the parent object."""
        if cast(CdmFileStatus, self.owner).report_most_recent_time_async and child_time:
            await cast(CdmFileStatus, self.owner).report_most_recent_time_async(child_time)

    def validate(self) -> bool:
        return bool(self.manifest_name) and bool(self.definition)

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        return False

    def _fetch_manifest_path(self) -> str:
        namespace = self.in_document.namespace
        prefix_path = self.in_document.folder_path
        return namespace + ':' + prefix_path + self.definition.lstrip('/')
