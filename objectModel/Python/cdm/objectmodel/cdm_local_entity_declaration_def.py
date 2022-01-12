﻿# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from datetime import datetime, timezone
from typing import cast, Dict, List, Optional, TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.utilities import ResolveOptions, time_utils, logger
from cdm.enums import CdmLogCode
from cdm.utilities.string_utils import StringUtils

from .cdm_collection import CdmCollection
from .cdm_entity_declaration_def import CdmEntityDeclarationDefinition
from .cdm_file_status import CdmFileStatus

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCollection, CdmCorpusContext, CdmCorpusDefinition, CdmDataPartitionDefinition, \
        CdmDataPartitionPatternDefinition
    from cdm.utilities import FriendlyFormatNode, VisitCallback

    from .cdm_trait_collection import CdmTraitCollection


class CdmLocalEntityDeclarationDefinition(CdmEntityDeclarationDefinition):
    def __init__(self, ctx: 'CdmCorpusContext', name: str) -> None:
        super().__init__(ctx, name)

        self._TAG = CdmLocalEntityDeclarationDefinition.__name__

        self.last_child_file_modified_time = None  # type: Optional[datetime]

        self.last_file_modified_time = None  # type: Optional[datetime]

        self.last_file_status_check_time = None  # type: Optional[datetime]

        self.last_file_modified_old_time = None  # type: Optional[datetime]

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

        context = self.ctx.corpus.storage.fetch_adapter(self.in_document._namespace).create_file_query_cache_context()
        try:
            full_path = self.ctx.corpus.storage.create_absolute_corpus_path(self.entity_path, self.in_document)
            modified_time = await self.ctx.corpus._compute_last_modified_time_async(full_path, self)

            for pattern in self.data_partition_patterns:
                await pattern.file_status_check_async()

            for partition in self.data_partitions:
                await partition.file_status_check_async()

            self.last_file_status_check_time = datetime.now(timezone.utc)
            self.set_last_file_modified_time(time_utils._max_time(modified_time, self.last_file_modified_time));

            await self.report_most_recent_time_async(self.last_file_modified_time)
        finally:
            context.dispose()

    def get_name(self) -> str:
        return self.entity_name

    def is_derived_from(self, base: str, res_opt: Optional['ResolveOptions'] = None) -> bool:
        return False

    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmLocalEntityDeclarationDefinition'] = None) -> 'CdmLocalEntityDeclarationDefinition':
        if not res_opt:
            res_opt = ResolveOptions(wrt_doc=self, directives=self.ctx.corpus.default_resolution_directives)
        if not host:
            copy = CdmLocalEntityDeclarationDefinition(self.ctx, self.entity_name)
        else:
            copy = host
            copy.entity_name = self.entity_name
            copy.data_partition_patterns.clear()
            copy.data_partitions.clear()

        copy.entity_path = self.entity_path
        copy.last_file_status_check_time = self.last_file_status_check_time
        copy.last_file_modified_time = self.last_file_modified_time
        copy.last_child_file_modified_time = self.last_child_file_modified_time

        for partition in self.data_partitions:
            copy.data_partitions.append(partition.copy(res_opt))

        for pattern in self.data_partition_patterns:
            copy.data_partition_patterns.append(pattern.copy(res_opt))

        self._copy_def(res_opt, copy)

        return copy

    async def report_most_recent_time_async(self, child_time: datetime) -> None:
        """Report most recent modified time (of current or children objects) to the parent object."""
        self.last_child_file_modified_time = child_time
        most_recent_at_this_level = time_utils._max_time(child_time, self.last_file_modified_time)

        if isinstance(self.owner, CdmFileStatus) and most_recent_at_this_level:
            await cast('CdmFileStatus', self.owner).report_most_recent_time_async(most_recent_at_this_level)

    def validate(self) -> bool:
        if not bool(self.entity_name):
            missing_fields = ['entity_name']
            logger.error(self.ctx, self._TAG, 'validate', self.at_corpus_path, CdmLogCode.ERR_VALDN_INTEGRITY_CHECK_FAILURE, self.at_corpus_path, ', '.join(map(lambda s: '\'' + s + '\'', missing_fields)))
            return False
        return True

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        path = self._fetch_declared_path(path_from)

        if pre_children and pre_children(self, path):
            return False

        if self.data_partitions and self.data_partitions._visit_array('{}/dataPartitions/'.format(path), pre_children, post_children):
            return True

        if self.data_partition_patterns and self.data_partition_patterns._visit_array('{}/dataPartitionPatterns/'.format(path), pre_children, post_children):
            return True

        if self._visit_def(path, pre_children, post_children):
            return True

        if post_children and post_children(self, path):
            return True

        return False

    def get_last_file_modified_time(self) -> datetime:
        return self.last_file_modified_time

    def set_last_file_modified_time(self, value: datetime) -> None:
        self.last_file_modified_old_time = self.last_file_modified_time
        self.last_file_modified_time = value

    def get_last_file_modified_old_time(self) -> datetime:
        return self.last_file_modified_old_time

    def reset_last_file_modified_old_time(self) -> None:
       self.last_file_modified_old_time = None