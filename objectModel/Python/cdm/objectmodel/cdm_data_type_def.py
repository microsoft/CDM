# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional, TYPE_CHECKING

from cdm.enums import CdmLogCode
from cdm.utilities.string_utils import StringUtils
from cdm.enums import CdmObjectType
from cdm.utilities import ResolveOptions, logger

from .cdm_object_def import CdmObjectDefinition

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmDataTypeReference
    from cdm.resolvedmodel import ResolvedTraitSetBuilder
    from cdm.utilities import FriendlyFormatNode, VisitCallback


class CdmDataTypeDefinition(CdmObjectDefinition):
    def __init__(self, ctx: 'CdmCorpusContext', data_type_name: str, extends_data_type: Optional['CdmDataTypeReference']) -> None:
        super().__init__(ctx)

        self._TAG = CdmDataTypeDefinition.__name__

        # the data type name.
        self.data_type_name = data_type_name  # type: str

        # the data type extended by this data type.
        self.extends_data_type = extends_data_type  # type: Optional[CdmDataTypeReference]

        self._declared_path = None  # type: Optional[str]

    @property
    def object_type(self) -> 'CdmObjectType':
        return CdmObjectType.DATA_TYPE_DEF

    def _construct_resolved_traits(self, rtsb: 'ResolvedTraitSetBuilder', res_opt: 'ResolveOptions') -> None:
        self._construct_resolved_traits_def(self.extends_data_type, rtsb, res_opt)

    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmDataTypeDefinition'] = None) -> 'CdmDataTypeDefinition':
        if not res_opt:
            res_opt = ResolveOptions(wrt_doc=self, directives=self.ctx.corpus.default_resolution_directives)

        if not host:
            copy = CdmDataTypeDefinition(self.ctx, self.data_type_name, None)
        else:
            copy = host
            copy.data_type_name = self.data_type_name

        if self.extends_data_type:
            copy.extends_data_type = self.extends_data_type.copy(res_opt)

        self._copy_def(res_opt, copy)
        return copy

    def validate(self) -> bool:
        if not bool(self.data_type_name):
            missing_fields = ['data_type_name']
            logger.error(self.ctx, self._TAG, 'validate', self.at_corpus_path, CdmLogCode.ERR_VALDN_INTEGRITY_CHECK_FAILURE, self.at_corpus_path, ', '.join(map(lambda s: '\'' + s + '\'', missing_fields)))
            return False
        return True

    def get_name(self) -> str:
        return self.data_type_name

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        path = self._fetch_declared_path(path_from)

        if pre_children and pre_children(self, path):
            return False

        if self.extends_data_type:
            self.extends_data_type.owner = self
            if self.extends_data_type.visit('{}/extendsDataType/'.format(path), pre_children, post_children):
                return True

        if self._visit_def(path, pre_children, post_children):
            return True

        if post_children and post_children(self, path):
            return True

        return False

    def is_derived_from(self, base: str, res_opt: Optional['ResolveOptions'] = None) -> bool:
        if not res_opt:
            res_opt = ResolveOptions(wrt_doc=self, directives=self.ctx.corpus.default_resolution_directives)
        return self._is_derived_from_def(res_opt, self.extends_data_type, self.get_name(), base)
