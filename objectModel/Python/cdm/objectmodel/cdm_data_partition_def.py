# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from datetime import datetime, timezone
from typing import cast, Dict, List, Optional, TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.utilities import ResolveOptions, time_utils, TraitToPropertyMap, logger

from .cdm_file_status import CdmFileStatus
from .cdm_object_def import CdmObjectDefinition

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext
    from cdm.utilities import VisitCallback


class CdmDataPartitionDefinition(CdmObjectDefinition, CdmFileStatus):
    def __init__(self, ctx: 'CdmCorpusContext', name: str) -> None:
        super().__init__(ctx)

        self._TAG = CdmDataPartitionDefinition.__name__

        # The name of a data partition.
        self.name = name  # type: str

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

        self.last_file_modified_time = None  # type: Optional[datetime]

        self.last_file_status_check_time = None  # type: Optional[datetime]

        # --- internal ---

        self._ttpm = TraitToPropertyMap(self)

    @property
    def object_type(self) -> 'CdmObjectType':
        return CdmObjectType.DATA_PARTITION_DEF

    @property
    def description(self) -> str:
        return cast(str, self._ttpm._fetch_property_value('description'))

    @description.setter
    def description(self, val: str) -> None:
        self._ttpm._update_property_value('description', val)

    @property
    def is_incremental(self) -> bool:
        """
         Gets whether the data partition is incremental.
        """
        return cast(bool, self._ttpm._fetch_property_value('isIncremental'))

    @property
    def last_child_file_modified_time(self) -> datetime:
        raise NotImplementedError()

    @last_child_file_modified_time.setter
    def last_child_file_modified_time(self, val: datetime):
        raise NotImplementedError()

    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmDataPartitionDefinition'] = None) -> 'CdmDataPartitionDefinition':
        if not res_opt:
            res_opt = ResolveOptions(wrt_doc=self, directives=self.ctx.corpus.default_resolution_directives)

        if not host:
            copy = CdmDataPartitionDefinition(self.ctx, self.name)
        else:
            copy = host
            copy.name = self.name

        copy.description = self.description
        copy.location = self.location
        copy.last_file_status_check_time = self.last_file_status_check_time
        copy.last_file_modified_time = self.last_file_modified_time
        copy.inferred = self.inferred
        if self.arguments:
            # deep copy the content
            copy.arguments = dict()
            for key in self.arguments.keys():
                copy.arguments[key] = list(self.arguments[key])
        copy.specialized_schema = self.specialized_schema
        self._copy_def(res_opt, copy)

        return copy

    async def file_status_check_async(self, file_status_check_options = None) -> None:
        """Check the modified time for this object and any children."""
        with logger._enter_scope(self._TAG, self.ctx, self.file_status_check_async.__name__):
            full_path = self.ctx.corpus.storage.create_absolute_corpus_path(self.location, self.in_document)
            partition_metadata = await self.ctx.corpus._get_file_metadata_from_partition_path_async(full_path)

            # Update modified times.
            self.last_file_status_check_time = datetime.now(timezone.utc)
            self.last_file_modified_time = time_utils._max_time(partition_metadata['last_modified_time'], self.last_file_modified_time) if partition_metadata and partition_metadata['last_modified_time'] else self.last_file_modified_time
            if file_status_check_options and file_status_check_options['include_data_partition_size'] and partition_metadata and partition_metadata['file_size_bytes']:
                self.exhibits_traits.append('is.partition.size', [['value', partition_metadata['file_size_bytes']]])

            await self.report_most_recent_time_async(self.last_file_modified_time)

    def get_name(self) -> str:
        return self.name

    def is_derived_from(self, base: str, res_opt: Optional['ResolveOptions'] = None) -> bool:
        return False

    async def report_most_recent_time_async(self, child_time: datetime) -> None:
        """Report most recent modified time (of current or children objects) to the parent object."""
        if isinstance(self.owner, CdmFileStatus) and child_time:
            await cast(CdmFileStatus, self.owner).report_most_recent_time_async(child_time)

    def validate(self) -> bool:
        return True

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        path = self._fetch_declared_path(path_from)

        if pre_children and pre_children(self, path):
            return False

        if self._visit_def(path, pre_children, post_children):
            return True

        if post_children and post_children(self, path):
            return True

        return False

    def _fetch_declared_path(self, path_from: str) -> str:
        return '{}{}'.format(path_from, (self.get_name() or 'UNNAMED'))
