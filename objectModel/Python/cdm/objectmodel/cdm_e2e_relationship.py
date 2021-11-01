# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional, TYPE_CHECKING
import warnings

from cdm.enums import CdmObjectType
from cdm.utilities import ResolveOptions, logger
from cdm.enums import CdmLogCode
from cdm.utilities.string_utils import StringUtils

from .cdm_object_def import CdmObjectDefinition
from datetime import datetime, timezone

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext
    from cdm.utilities import FriendlyFormatNode, VisitCallback


class CdmE2ERelationship(CdmObjectDefinition):
    def __init__(self, ctx: 'CdmCorpusContext', name: str) -> None:
        super().__init__(ctx)

        self._TAG = CdmE2ERelationship.__name__
        self.name = name  # type: str
        self.from_entity = None  # type: Optional[str]
        self.from_entity_attribute = None  # type: Optional[str]
        self.to_entity = None  # type: Optional[str]
        self.to_entity_attribute = None  # type: Optional[str]
        self.last_file_modified_time = None  # type: Optional[datetime]
        self.last_file_modified_old_time = None  # type: Optional[datetime]

    @property
    def object_type(self) -> 'CdmObjectType':
        return CdmObjectType.E2E_RELATIONSHIP_DEF

    @property
    def relationship_name(self) -> str:
        warnings.warn('This property has been deprecated, use the `name` property instead.', DeprecationWarning)
        return self.name
    
    @relationship_name.setter
    def relationship_name(self, name):
        warnings.warn('This property has been deprecated, use the `name` property instead.', DeprecationWarning)
        self.name = name

    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmE2ERelationship'] = None) -> 'CdmE2ERelationship':
        if not res_opt:
            res_opt = ResolveOptions(wrt_doc=self, directives=self.ctx.corpus.default_resolution_directives)

        if not host:
            copy = CdmE2ERelationship(self.ctx, self.get_name())
        else:
            copy = host
            copy.name = self.get_name()

        copy.from_entity = self.from_entity
        copy.from_entity_attribute = self.from_entity_attribute
        copy.to_entity = self.to_entity
        copy.to_entity_attribute = self.to_entity_attribute
        self._copy_def(res_opt, copy)

        return copy

    def get_name(self) -> str:
        return self.name

    def is_derived_from(self, base: str, res_opt: Optional['ResolveOptions'] = None) -> bool:
        return False

    def validate(self) -> bool:
        missing_fields = []
        if not bool(self.from_entity):
            missing_fields.append('from_entity')
        if not bool(self.from_entity_attribute):
            missing_fields.append('from_entity_attribute')
        if not bool(self.to_entity):
            missing_fields.append('to_entity')
        if not bool(self.to_entity_attribute):
            missing_fields.append('to_entity_attribute')

        if missing_fields:
            logger.error(self.ctx, self._TAG, 'validate', self.at_corpus_path, CdmLogCode.ERR_VALDN_INTEGRITY_CHECK_FAILURE, self.at_corpus_path, ', '.join(map(lambda s: '\'' + s + '\'', missing_fields)))
            return False
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

    def get_last_file_modified_time(self) -> datetime:
        return self.last_file_modified_time

    def set_last_file_modified_time(self, value: datetime) -> None:
        self.last_file_modified_old_time = self.last_file_modified_time
        self.last_file_modified_time = value

    def get_last_file_modified_old_time(self) -> datetime:
        return self.last_file_modified_old_time

    def reset_last_file_modified_old_time(self) -> None:
        self.last_file_modified_old_time = None

    def create_cache_key(self) -> str:
        """"standardized way of turning a relationship object into a key for caching
        without using the object itself as a key (could be duplicate relationship objects)"""
        name_and_pipe = ''
        if self.name:
            name_and_pipe = '{}|'.format(self.name)
        return '{}{}|{}|{}|{}'.format(name_and_pipe, self.to_entity, self.to_entity_attribute, self.from_entity, self.from_entity_attribute)
