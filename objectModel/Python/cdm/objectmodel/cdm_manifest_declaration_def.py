# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from datetime import datetime, timezone
from typing import cast, Optional, TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.utilities import ResolveOptions, time_utils, logger, Errors

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

        self._TAG = CdmManifestDeclarationDefinition.__name__

    @property
    def object_type(self) -> 'CdmObjectType':
        return CdmObjectType.MANIFEST_DECLARATION_DEF

    def _construct_resolved_attributes(self, res_opt: 'ResolveOptions', under: Optional['CdmAttributeContext']) -> 'ResolvedAttributeSetBuilder':
        return None

    def _construct_resolved_traits(self, rtsb: 'ResolvedTraitSetBuilder', res_opt: 'ResolveOptions') -> None:
        pass

    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmManifestDeclarationDefinition'] = None) -> 'CdmManifestDeclarationDefinition':
        if not res_opt:
            res_opt = ResolveOptions(wrt_doc=self)

        if not host:
            copy = CdmManifestDeclarationDefinition(self.ctx, self.manifest_name)
        else:
            copy = host
            copy.ctx = self.ctx
            copy.manifest_name = self.get_name()

        copy.definition = self.definition
        copy.last_file_status_check_time = self.last_file_status_check_time
        copy.last_file_modified_time = self.last_file_modified_time
        self._copy_def(res_opt, copy)

        return copy

    async def file_status_check_async(self) -> None:
        """Check the modified time for this object and any children."""
        full_path = self.ctx.corpus.storage.create_absolute_corpus_path(self.definition, self.in_document)
        modified_time = await cast('CdmCorpusDefinition', self.ctx.corpus)._compute_last_modified_time_async(full_path, self)

        self.last_file_status_check_time = datetime.now(timezone.utc)
        self.last_file_modified_time = time_utils._max_time(modified_time, self.last_file_modified_time)

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
        missing_fields = []
        if not bool(self.manifest_name):
            missing_fields.append('manifest_name')
        if not bool(self.definition):
            missing_fields.append('definition')

        if missing_fields:
            logger.error(self._TAG, self.ctx, Errors.validate_error_string(self.at_corpus_path, missing_fields))
            return False
        return True

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        path = ''
        if self.ctx.corpus._block_declared_path_changes is False:
            path = self._declared_path
            if not path:
                path = '{}{}'.format(path_from, self.get_name())
                self._declared_path = path

        if pre_children and pre_children(self, path):
            return False

        if self._visit_def(path, pre_children, post_children):
            return True

        if post_children and post_children(self, path):
            return False

        return False
