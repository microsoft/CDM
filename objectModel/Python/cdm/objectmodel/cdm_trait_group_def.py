# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional, TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.utilities import ResolveOptions, logger
from cdm.enums import CdmLogCode

from .cdm_object_def import CdmObjectDefinition

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext
    from cdm.utilities import VisitCallback


class CdmTraitGroupDefinition(CdmObjectDefinition):
    """
    The CDM definition of a Trait Group object, representing a collection (grouping) of one or more traits.
    """
    def __init__(self, ctx: 'CdmCorpusContext', trait_group_name: str) -> None:
        super().__init__(ctx)

        self._TAG = CdmTraitGroupDefinition.__name__

        # the trait name.
        self.trait_group_name = trait_group_name  # type: str

    @property
    def object_type(self) -> CdmObjectType:
        return CdmObjectType.TRAIT_GROUP_DEF

    def get_name(self):
        return self.trait_group_name

    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmTraitGroupDefinition'] = None) \
            -> 'CdmTraitGroupDefinition':
        if not res_opt:
            res_opt = ResolveOptions(wrt_doc=self, directives=self.ctx.corpus.default_resolution_directives)

        if not host:
            copy = CdmTraitGroupDefinition(self.ctx, self.trait_group_name)
        else:
            copy = host
            copy.trait_group_name = self.trait_group_name

        self._copy_def(res_opt, copy)
        return copy

    def validate(self) -> bool:
        if not bool(self.trait_group_name):
            missing_fields = ['trait_group_name']
            logger.error(self.ctx, self._TAG, 'validate', self.at_corpus_path,
                         CdmLogCode.ERR_VALDN_INTEGRITY_CHECK_FAILURE, self.at_corpus_path,
                         ', '.join(map(lambda s: '\'' + s + '\'', missing_fields)))
            return False
        return True

    def is_derived_from(self, base: str, res_opt: Optional['ResolveOptions'] = None) -> bool:
        return False

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        path = self._fetch_declared_path(path_from)

        if pre_children and pre_children(self, path):
            return False

        if self._visit_def(path, pre_children, post_children):
            return True

        if post_children and post_children(self, path):
            return True

        return False

    def _construct_resolved_traits(self, rtsb: 'ResolvedTraitSetBuilder', res_opt: 'ResolveOptions') -> None:
        super()._construct_resolved_traits_def(None, rtsb, res_opt)

    def _construct_resolved_attributes(self, res_opt: 'ResolveOptions', under: Optional['CdmAttributeContext'] = None) \
            -> None:
        return None
