# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from collections import defaultdict
from datetime import datetime, timezone
from typing import cast, Dict, List, Optional, TYPE_CHECKING
import regex

from cdm.enums import CdmObjectType
from cdm.utilities import logger, ResolveOptions

from .cdm_file_status import CdmFileStatus
from .cdm_local_entity_declaration_def import CdmLocalEntityDeclarationDefinition
from .cdm_object_def import CdmObjectDefinition

if TYPE_CHECKING:
    from cdm.objectmodel import CdmAttributeItem, CdmCorpusContext, CdmCorpusDefinition, CdmObjectReference
    from cdm.utilities import FriendlyFormatNode, VisitCallback


class CdmDataPartitionPatternDefinition(CdmObjectDefinition, CdmFileStatus):
    def __init__(self, ctx: 'CdmCorpusContext', name: str) -> None:
        super().__init__(ctx)

        # The partition pattern name.
        self.name = name  # type: str

        # The starting location corpus path for searching for inferred data partitions.
        self.root_location = None  # type: Optional[str]

        # The regular expression to use for searching partitions.
        self.regular_expression = None  # type: Optional[str]

        # the names for replacement values from regular expression.
        self.parameters = None  # type: Optional[List[str]]

        # The corpus path for specialized schema to use for matched pattern partitions.
        self.specialized_schema = None  # type: Optional[str]

        self.last_file_status_check_time = None  # type: Optional[datetime]

        self.last_file_modified_time = None  # type: Optional[datetime]

        self._TAG = CdmDataPartitionPatternDefinition.__name__

    @property
    def object_type(self) -> 'CdmObjectType':
        return CdmObjectType.DATA_PARTITION_PATTERN_DEF

    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmDataPartitionPatternDefinition'] = None) -> 'CdmDataPartitionPatternDefinition':
        if not res_opt:
            res_opt = ResolveOptions(wrt_doc=self)

        if not host:
            copy = CdmDataPartitionPatternDefinition(self.ctx, self.name)
        else:
            copy = host
            copy.ctx = self.ctx
            copy.name = self.name

        copy.root_location = self.root_location
        copy.regular_expression = self.regular_expression
        copy.parameters = self.parameters
        copy.last_file_status_check_time = self.last_file_status_check_time
        copy.last_file_modified_time = self.last_file_modified_time
        if self.specialized_schema:
            copy.specialized_schema = self.specialized_schema
        self._copy_def(res_opt, copy)

        return copy

    async def file_status_check_async(self) -> None:
        """Check the modified time for this object and any children."""
        namespace = self.in_document.namespace
        adapter = self.ctx.corpus.storage.fetch_adapter(namespace)

        if adapter is None:
            logger.error(self._TAG, self.ctx, 'Adapter not found for the document {}'.format(self.in_document.name), self.file_status_check_async.__name__)

        # make sure the root is a good full corpus path.
        root_cleaned = (self.root_location or '').rstrip('/')
        root_corpus = self.ctx.corpus.storage.create_absolute_corpus_path(root_cleaned, self.in_document)

        try:
            # get a list of all corpus_paths under the root.
            file_info_list = await adapter.fetch_all_files_async(root_corpus)
        except Exception as e:
            logger.warning(self._TAG, self.ctx, 'The folder location \'{}\' described by a partition pattern does not exist'.format(root_corpus), self.file_status_check_async.__name__)

        if file_info_list is not None:
            # remove root of the search from the beginning of all paths so anything in the root is not found by regex.
            file_info_list = [(namespace + ':' + fi)[len(root_corpus):] for fi in file_info_list]

            reg = regex.compile(self.regular_expression)

            if isinstance(self.owner, CdmLocalEntityDeclarationDefinition):
                for fi in file_info_list:
                    m = reg.fullmatch(fi)
                    if m:
                        # create a map of arguments out of capture groups.
                        args = defaultdict(list)  # type: Dict[str, List[str]]
                        i_param = 0
                        for i in range(1, reg.groups + 1):
                            captures = m.captures(i)
                            if captures and self.parameters and i_param < len(self.parameters):
                                # to be consistent with other languages, if a capture group captures
                                # multiple things, only use the last thing that was captured
                                single_capture = captures[-1]

                                current_param = self.parameters[i_param]
                                args[current_param].append(single_capture)
                                i_param += 1
                            else:
                                break

                        # put the original but cleaned up root back onto the matched doc as the location stored in the partition.
                        location_corpus_path = root_cleaned + fi
                        last_modified_time = await adapter.compute_last_modified_time_async(adapter.create_adapter_path(location_corpus_path))
                        cast('CdmLocalEntityDeclarationDefinition', self.owner)._create_partition_from_pattern(
                            location_corpus_path, self.exhibits_traits, args, self.specialized_schema, last_modified_time)

        # update modified times.
        self.last_file_status_check_time = datetime.now(timezone.utc)

    def get_name(self) -> str:
        return self.name

    def is_derived_from(self, base: str, res_opt: Optional['ResolveOptions'] = None) -> bool:
        return False

    async def report_most_recent_time_async(self, child_time: datetime) -> None:
        """Report most recent modified time (of current or children objects) to the parent object."""
        if isinstance(self.owner, CdmFileStatus) and child_time:
            await cast(CdmFileStatus, self.owner).report_most_recent_time_async(child_time)

    def validate(self) -> bool:
        return bool(self.name) and bool(self.root_location)

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        path = ''
        if self.ctx.corpus._block_declared_path_changes is False:
            path = self._declared_path
            if not path:
                path = path_from + self.get_name() or 'UNNAMED'
                self._declared_path = path

        if pre_children and pre_children(self, path):
            return False

        if self._visit_def(path, pre_children, post_children):
            return True

        if post_children and post_children(self, path):
            return False

        return False
