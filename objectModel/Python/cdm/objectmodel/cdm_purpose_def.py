# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional, TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.utilities import ResolveOptions, logger, Errors

from .cdm_object_def import CdmObjectDefinition

if TYPE_CHECKING:
    from datetime import datetime

    from cdm.objectmodel import CdmCorpusContext, CdmObjectReference, CdmPurposeReference
    from cdm.utilities import FriendlyFormatNode, VisitCallback


class CdmPurposeDefinition(CdmObjectDefinition):
    def __init__(self, ctx: 'CdmCorpusContext', name: str, extends_purpose: Optional['CdmPurposeReference']) -> None:
        super().__init__(ctx)

        # the purpose name.
        self.purpose_name = name  # type: str

        # the reference to the purpose extended by this.
        self.extends_purpose = extends_purpose  # type: Optional[CdmPurposeReference]

        self._TAG = CdmPurposeDefinition.__name__

    @property
    def object_type(self) -> 'CdmObjectType':
        return CdmObjectType.PURPOSE_DEF

    def _construct_resolved_attributes(self, res_opt: 'ResolveOptions', under: Optional['CdmAttributeContext']) -> 'ResolvedAttributeSetBuilder':
        return None

    def _construct_resolved_traits(self, rtsb: 'ResolvedTraitSetBuilder', res_opt: 'ResolveOptions') -> None:
        self._construct_resolved_traits_def(self.extends_purpose, rtsb, res_opt)

    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmPurposeDefinition'] = None) -> 'CdmPurposeDefinition':
        if not res_opt:
            res_opt = ResolveOptions(wrt_doc=self, directives=self.ctx.corpus.default_resolution_directives)

        if not host:
            copy = CdmPurposeDefinition(self.ctx, self.purpose_name, None)
        else:
            copy = host
            copy.ctx = self.ctx
            copy.purpose_name = self.purpose_name

        if self.extends_purpose:
            copy.extends_purpose = self.extends_purpose.copy(res_opt)

        self._copy_def(res_opt, copy)

        return copy

    def get_name(self) -> str:
        return self.purpose_name

    def is_derived_from(self, base: str, res_opt: Optional['ResolveOptions'] = None) -> bool:
        res_opt = res_opt if res_opt is not None else ResolveOptions(self, self.ctx.corpus.default_resolution_directives)
        return self._is_derived_from_def(res_opt, self.extends_purpose, self.get_name(), base)

    def validate(self) -> bool:
        if not bool(self.purpose_name):
            logger.error(self._TAG, self.ctx, Errors.validate_error_string(self.at_corpus_path, ['purpose_name']))
            return False
        return True

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        path = ''
        if self.ctx.corpus._block_declared_path_changes is False:
            path = self._declared_path
            if not path:
                path = path_from + self.purpose_name
                self._declared_path = path

        if pre_children and pre_children(self, path):
            return False

        if self.extends_purpose and self.extends_purpose.visit('{}/extendsPurpose/'.format(path), pre_children, post_children):
            return True

        if self._visit_def(path, pre_children, post_children):
            return True

        if post_children and post_children(self, path):
            return True

        return False
