# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from datetime import datetime, timezone
from typing import cast, Dict, List, Optional, TYPE_CHECKING

from cdm.enums import CdmObjectType, CdmIncrementalPartitionType, PartitionFileStatusCheckType
from cdm.utilities import ResolveOptions, time_utils, logger, Constants
from cdm.enums import CdmLogCode

from .cdm_collection import CdmCollection
from .cdm_entity_declaration_def import CdmEntityDeclarationDefinition
from .cdm_file_status import CdmFileStatus
from ..utilities.string_utils import StringUtils

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCollection, CdmCorpusContext, CdmDataPartitionDefinition, \
        CdmDataPartitionPatternDefinition, CdmObjectDefinition
    from cdm.utilities import VisitCallback

    from .cdm_trait_collection import CdmTraitCollection


class CdmLocalEntityDeclarationDefinition(CdmEntityDeclarationDefinition):
    def __init__(self, ctx: 'CdmCorpusContext', name: str) -> None:
        super().__init__(ctx, name)

        self._TAG = CdmLocalEntityDeclarationDefinition.__name__

        self.last_child_file_modified_time = None  # type: Optional[datetime]

        self.last_file_modified_time = None  # type: Optional[datetime]

        self.last_file_status_check_time = None  # type: Optional[datetime]

        self.last_file_modified_old_time = None  # type: Optional[datetime]

        # --- internal ---
        self._data_partitions = CdmCollection(self.ctx, self, CdmObjectType.DATA_PARTITION_DEF)
        self._data_partition_patterns = CdmCollection(self.ctx, self, CdmObjectType.DATA_PARTITION_PATTERN_DEF)
        self._incremental_partitions = CdmCollection(self.ctx, self, CdmObjectType.DATA_PARTITION_DEF)
        self._incremental_partition_patterns = CdmCollection(self.ctx, self, CdmObjectType.DATA_PARTITION_PATTERN_DEF)
        self._virtual_location = None

    @property
    def object_type(self) -> 'CdmObjectType':
        return CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF

    @property
    def data_partitions(self) -> 'CdmCollection[CdmDataPartitionDefinition]':
        return self._data_partitions

    @property
    def data_partition_patterns(self) -> 'CdmCollection[CdmDataPartitionPatternDefinition]':
        return self._data_partition_patterns

    @property
    def incremental_partitions(self) -> 'CdmCollection[CdmDataPartitionDefinition]':
        return self._incremental_partitions

    @property
    def incremental_partition_patterns(self) -> 'CdmCollection[CdmDataPartitionPatternDefinition]':
        return self._incremental_partition_patterns

    @property
    def _is_virtual(self) -> bool:
        """Gets whether this entity is virtual, which means it's coming from model.json file"""
        return not StringUtils.is_null_or_white_space(self._virtual_location)

    def _create_partition_from_pattern(self, file_path: str, exhibits_traits: 'CdmTraitCollection',
                                       args: Dict[str, List[str]], schema: str, modified_time: datetime,
                                       is_incremental_partition: Optional[bool] = False,
                                       increment_partition_pattern_name: Optional[str] = None) -> None:
        """
        Create a data partition object using the input, should be called by DataPartitionPattern object.
        This function doesn't check if the data partition exists.
        """

        new_partition = self.ctx.corpus.make_object(CdmObjectType.DATA_PARTITION_DEF)
        new_partition.location = file_path
        new_partition.specialized_schema = schema
        new_partition.last_file_modified_time = modified_time
        new_partition.last_file_status_check_time = datetime.now(timezone.utc)

        for trait in exhibits_traits:
            new_partition.exhibits_traits.append(cast('CdmTraitReferenceBase', trait.copy()))

        new_partition.arguments = args.copy()

        if not is_incremental_partition:
            self.data_partitions.append(new_partition)
        else:
            if not StringUtils.is_null_or_white_space(increment_partition_pattern_name):
                cast('CdmTraitReference',
                     new_partition.exhibits_traits.item(Constants._INCREMENTAL_TRAIT_NAME)).arguments.append(
                    Constants._INCREMENTAL_PATTERN_PARAMETER_NAME, increment_partition_pattern_name)
            self.incremental_partitions.append(new_partition)

    async def file_status_check_async(self, partition_file_status_check_type: Optional[
        'PartitionFileStatusCheckType'] = PartitionFileStatusCheckType.FULL, incremental_type: Optional[
        'CdmIncrementalPartitionType'] = CdmIncrementalPartitionType.NONE) -> None:
        """Check the modified time for this object and any children."""

        context = self.ctx.corpus.storage.fetch_adapter(self.in_document._namespace).create_file_query_cache_context()
        try:
            full_path = self.ctx.corpus.storage.create_absolute_corpus_path(self.entity_path, self.in_document)
            modified_time = await self.ctx.corpus._get_last_modified_time_from_object_async(self) if self._is_virtual \
                else await self.ctx.corpus._compute_last_modified_time_async(full_path, self)

            # check patterns first as this is a more performant way of querying file modification times
            # from ADLS and we can cache the times for reuse in the individual partition checks below

            if partition_file_status_check_type == partition_file_status_check_type.FULL or partition_file_status_check_type == PartitionFileStatusCheckType.FULL_AND_INCREMENTAL:
                from cdm.objectmodel import CdmDataPartitionDefinition, CdmDataPartitionPatternDefinition
                for pattern in self.data_partition_patterns:
                    if pattern.is_incremental:
                        logger.error(pattern.ctx, self._TAG, self.file_status_check_async.__name__,
                                     pattern.at_corpus_path, CdmLogCode.ERR_UNEXPECTED_INCREMENTAL_PARTITION_TRAIT,
                                     CdmDataPartitionPatternDefinition.__name__, pattern.fetch_object_definition_name(),
                                     Constants._INCREMENTAL_TRAIT_NAME,
                                     CdmLocalEntityDeclarationDefinition.data_partition_patterns.fget.__name__)
                    else:
                        await pattern.file_status_check_async()

                for partition in self.data_partitions:
                    if partition.is_incremental:
                        logger.error(partition.ctx, self._TAG, self.file_status_check_async.__name__,
                                     partition.at_corpus_path, CdmLogCode.ERR_UNEXPECTED_INCREMENTAL_PARTITION_TRAIT,
                                     CdmDataPartitionDefinition.__name__, partition.fetch_object_definition_name(),
                                     Constants._INCREMENTAL_TRAIT_NAME,
                                     CdmLocalEntityDeclarationDefinition.data_partitions.fget.__name__)
                    else:
                        await partition.file_status_check_async()

            if partition_file_status_check_type == partition_file_status_check_type.INCREMENTAL or partition_file_status_check_type == PartitionFileStatusCheckType.FULL_AND_INCREMENTAL:
                for pattern in self.incremental_partition_patterns:
                    if self._should_call_file_status_check(incremental_type, True, pattern):
                        await pattern.file_status_check_async()

                for partition in self.incremental_partitions:
                    if self._should_call_file_status_check(incremental_type, False, partition):
                        await partition.file_status_check_async()

            # update modified times
            self.last_file_status_check_time = datetime.now(timezone.utc)
            self.set_last_file_modified_time(time_utils._max_time(modified_time, self.last_file_modified_time))

            await self.report_most_recent_time_async(self.last_file_modified_time)
        finally:
            context.dispose()

    def _should_call_file_status_check(self, incremental_type: 'CdmIncrementalPartitionType', is_pattern: bool,
                                       pattern_or_partition_obj: 'CdmObjectDefinition') -> bool:
        """
        Determine if calling FileStatusCheckAsync on the given pattern or the given partition is needed.
        :type incremental_type: CdmIncrementalPartitionType  The incremental type.
        :type is_pattern: bool Whether the object is a pattern object or a partition object.
        :type pattern_or_partition_obj: CdmObjectDefinition The pattern object if isPattern is true, otherwise the partition object.
        """
        update = True

        trait_ref = cast('CdmTraitReference',
                         pattern_or_partition_obj.exhibits_traits.item(Constants._INCREMENTAL_TRAIT_NAME))
        if trait_ref == None:
            from cdm.objectmodel import CdmDataPartitionDefinition, CdmDataPartitionPatternDefinition
            logger.error(pattern_or_partition_obj.ctx, self._TAG, self._should_call_file_status_check.__name__,
                         pattern_or_partition_obj.at_corpus_path,
                         CdmLogCode.ERR_MISSING_INCREMENTAL_PARTITION_TRAIT,
                         CdmDataPartitionPatternDefinition.__name__ if is_pattern else CdmDataPartitionDefinition.__name__,
                         pattern_or_partition_obj.fetch_object_definition_name(), Constants._INCREMENTAL_TRAIT_NAME,
                         CdmLocalEntityDeclarationDefinition.incremental_partition_patterns.fget.__name__ if is_pattern else CdmLocalEntityDeclarationDefinition.incremental_partitions.fget.__name__)
        else:
            # None means update by default
            if incremental_type == CdmIncrementalPartitionType.NONE:
                return update
            trait_ref_incremental_type_value = trait_ref.arguments.fetch_value('type') if trait_ref.arguments else None
            if trait_ref_incremental_type_value == None:
                update = False
                logger.error(pattern_or_partition_obj.ctx, self._TAG, self._should_call_file_status_check.__name__,
                             pattern_or_partition_obj.at_corpus_path, CdmLogCode.ERR_TRAIT_ARGUMENT_MISSING,
                             'type', Constants._INCREMENTAL_TRAIT_NAME,
                             pattern_or_partition_obj.fetch_object_definition_name())
            elif not isinstance(trait_ref_incremental_type_value, str):
                update = False
                logger.error(pattern_or_partition_obj.ctx, self._TAG, self._should_call_file_status_check.__name__,
                             pattern_or_partition_obj.at_corpus_path, CdmLogCode.ERR_TRAIT_INVALID_ARGUMENT_VALUE_TYPE,
                             'type', Constants._INCREMENTAL_TRAIT_NAME,
                             pattern_or_partition_obj.fetch_object_definition_name())
            else:
                trait_ref_incremental_type_str = StringUtils.snake_case_to_pascal_case(
                    trait_ref_incremental_type_value).upper()
                if trait_ref_incremental_type_str and trait_ref_incremental_type_str in CdmIncrementalPartitionType.__members__.keys():
                    update = CdmIncrementalPartitionType[trait_ref_incremental_type_str] == incremental_type
                else:
                    update = False
                    logger.error(pattern_or_partition_obj.ctx, self._TAG, self._should_call_file_status_check.__name__,
                                 pattern_or_partition_obj.at_corpus_path, CdmLogCode.ERR_ENUM_CONVERSION_FAILURE,
                                 trait_ref_incremental_type_value, CdmIncrementalPartitionType.__name__,
                                 'parameter \'type\' of trait \'{}\' from \'{}\''.format(
                                     Constants._INCREMENTAL_TRAIT_NAME,
                                     pattern_or_partition_obj.fetch_object_definition_name()))

        return update

    def get_name(self) -> str:
        return self.entity_name

    def is_derived_from(self, base: str, res_opt: Optional['ResolveOptions'] = None) -> bool:
        return False

    def copy(self, res_opt: Optional['ResolveOptions'] = None,
             host: Optional['CdmLocalEntityDeclarationDefinition'] = None) -> 'CdmLocalEntityDeclarationDefinition':
        if not res_opt:
            res_opt = ResolveOptions(wrt_doc=self, directives=self.ctx.corpus.default_resolution_directives)
        if not host:
            copy = CdmLocalEntityDeclarationDefinition(self.ctx, self.entity_name)
        else:
            copy = host
            copy.entity_name = self.entity_name
            copy.data_partition_patterns.clear()
            copy.data_partitions.clear()
            copy.incremental_partition_patterns.clear()
            copy.incremental_partitions.clear()

        copy.entity_path = self.entity_path
        copy.last_file_status_check_time = self.last_file_status_check_time
        copy.last_file_modified_time = self.last_file_modified_time
        copy.last_child_file_modified_time = self.last_child_file_modified_time
        copy._virtual_location = self._virtual_location

        for partition in self.data_partitions:
            copy.data_partitions.append(partition.copy(res_opt))

        for pattern in self.data_partition_patterns:
            copy.data_partition_patterns.append(pattern.copy(res_opt))

        for partition in self.incremental_partitions:
            copy.incremental_partitions.append(partition.copy(res_opt))

        for pattern in self.incremental_partition_patterns:
            copy.incremental_partition_patterns.append(pattern.copy(res_opt))

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
            logger.error(self.ctx, self._TAG, 'validate', self.at_corpus_path,
                         CdmLogCode.ERR_VALDN_INTEGRITY_CHECK_FAILURE, self.at_corpus_path,
                         ', '.join(map(lambda s: '\'' + s + '\'', missing_fields)))
            return False
        return True

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        path = self._fetch_declared_path(path_from)

        if pre_children and pre_children(self, path):
            return False

        if self.data_partitions and self.data_partitions._visit_array('{}/dataPartitions/'.format(path), pre_children,
                                                                      post_children):
            return True

        if self.data_partition_patterns and self.data_partition_patterns._visit_array(
                '{}/dataPartitionPatterns/'.format(path), pre_children, post_children):
            return True

        if self.incremental_partitions and self.incremental_partitions._visit_array(
                '{}/incrementalPartitions/'.format(path), pre_children,
                post_children):
            return True

        if self.incremental_partition_patterns and self.incremental_partition_patterns._visit_array(
                '{}/incrementalPartitionPatterns/'.format(path), pre_children, post_children):
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
