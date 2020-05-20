# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional, TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.utilities import ResolveOptions, logger, Errors

from .cdm_object import CdmObject
from .cdm_object_simple import CdmObjectSimple

if TYPE_CHECKING:
    from cdm.objectmodel import CdmArgumentValue, CdmCorpusContext, CdmDataTypeReference
    from cdm.utilities import FriendlyFormatNode, lang_utils, VisitCallback


class CdmParameterDefinition(CdmObjectSimple):
    def __init__(self, ctx: 'CdmCorpusContext', name: str) -> None:
        super().__init__(ctx)

        # the parameter name.
        self.name = name

        # the parameter explanation.
        self.explanation = None  # type: Optional[str]

        # the parameter default value.
        self.default_value = None  # type: Optional[CdmArgumentValue]

        # if the parameter is required.
        self.required = False  # type: Optional[bool]

        # the parameter data type reference.
        self.data_type_ref = None  # type: Optional[CdmDataTypeReference]

        # Internal

        self._declared_path = None  # type: Optional[str]

        self._TAG = CdmParameterDefinition.__name__

    @property
    def object_type(self) -> 'CdmObjectType':
        return CdmObjectType.PARAMETER_DEF

    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmParameterDefinition'] = None) -> 'CdmParameterDefinition':
        if not res_opt:
            res_opt = ResolveOptions(wrt_doc=self)

        if not host:
            copy = CdmParameterDefinition(self.ctx, self.name)
        else:
            copy = host
            copy.ctx = self.ctx
            copy.name = self.name

        def_val = None
        if self.default_value:
            if isinstance(self.default_value, CdmObject):
                def_val = self.default_value.copy(res_opt)
            elif isinstance(self.default_value, dict):
                def_val = dict(self.default_value)
            else:
                def_val = self.default_value

        copy.explanation = self.explanation
        copy.default_value = def_val
        copy.required = self.required
        copy.data_type_ref = self.data_type_ref.copy(res_opt) if self.data_type_ref else None

        return copy

    def validate(self) -> bool:
        if not bool(self.name):
            logger.error(self._TAG, self.ctx, Errors.validate_error_string(self.at_corpus_path, ['name']))
            return False
        return True

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        path = ''
        if self.ctx.corpus._block_declared_path_changes is False:
            path = self._declared_path
            if not path:
                path = path_from + self.name
                self._declared_path = path

        if pre_children and pre_children(self, path):
            return False

        if isinstance(self.default_value, CdmObject) and self.default_value.visit('{}/defaultValue/'.format(path), pre_children, post_children):
            return True

        if self.data_type_ref and self.data_type_ref.visit('{}/dataType/'.format(path), pre_children, post_children):
            return True

        if post_children and post_children(self, path):
            return True

        return False
