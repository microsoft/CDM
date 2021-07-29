# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional, TYPE_CHECKING
import copy

from cdm.enums import CdmObjectType
from cdm.utilities import ResolveOptions, logger

from cdm.enums import CdmLogCode
from .cdm_object import CdmObject
from .cdm_object_simple import CdmObjectSimple

if TYPE_CHECKING:
    from cdm.objectmodel import CdmArgumentValue, CdmCorpusContext, CdmParameterDefinition
    from cdm.utilities import VisitCallback


class CdmArgumentDefinition(CdmObjectSimple):
    def __init__(self, ctx: 'CdmCorpusContext', name: str) -> None:
        super().__init__(ctx)

        self._TAG = CdmArgumentDefinition.__name__

        # the argument explanation.
        self.explanation = None  # type: Optional[str]

        # the argument name.
        self.name = name  # type: str

        # the argument value.
        self.value = None  # type: Optional[CdmArgumentValue]

        # Internal

        self._resolved_parameter = None
        self._declared_path = None  # Optional[str]
        self._unresolved_value = None  # type: Optional[CdmArgumentValue]

    @property
    def object_type(self) -> CdmObjectType:
        return CdmObjectType.ARGUMENT_DEF

    def _get_parameter_def(self) -> 'CdmParameterDefinition':
        return self._resolved_parameter

    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmArgumentDefinition'] = None) -> 'CdmArgumentDefinition':
        res_opt = res_opt if res_opt is not None else ResolveOptions(wrt_doc=self, directives=self.ctx.corpus.default_resolution_directives)

        if not host:
            copy_obj = CdmArgumentDefinition(self.ctx, self.name)
        else:
            copy_obj = host
            copy_obj.ctx = self.ctx
            copy_obj.name = self.name

        if self.value:
            if isinstance(self.value, CdmObject):
                copy_obj.value = self.value.copy(res_opt)
            elif isinstance(self.value, object):
                copy_obj.value = copy.copy(self.value)
            else:
                copy_obj.value = self.value

        copy_obj._resolved_parameter = self._resolved_parameter
        copy_obj.explanation = self.explanation
        return copy_obj

    def get_name(self) -> str:
        return self.name

    def set_value(self, value):
        self.value = value

    def validate(self) -> bool:
        if self.value is None:
            missing_fields = ['value']
            logger.error(self.ctx, self._TAG, 'validate', self.at_corpus_path, CdmLogCode.ERR_VALDN_INTEGRITY_CHECK_FAILURE, self.at_corpus_path, ', '.join(map(lambda s: '\'' + s + '\'', missing_fields)))
            return False
        return True

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        path = ''
        if self.ctx.corpus._block_declared_path_changes is False:
            path = self._declared_path
            if not path:
                path = path_from # name of arg is forced down from trait ref. you get what you get and you don't throw a fit.
                self._declared_path = path

        if pre_children and pre_children(self, path):
            return False

        if self.value:
            if isinstance(self.value, CdmObject):
                if self.value.visit(path + '/value/', pre_children, post_children):
                    return True

        if post_children and post_children(self, path):
            return True

        return False
