# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from abc import abstractmethod
from typing import Optional, TYPE_CHECKING

from cdm.enums import CdmLogCode
from cdm.utilities import logger

from .cdm_object import CdmObject
from .cdm_object_ref import CdmObjectReference
from .cdm_trait_collection import CdmTraitCollection

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmTraitDefinition, CdmTraitReference
    from cdm.resolvedmodel import ResolvedTraitSetBuilder
    from cdm.utilities import ResolveOptions, VisitCallback


class CdmObjectDefinition(CdmObject):
    def __init__(self, ctx: 'CdmCorpusContext') -> None:
        super().__init__(ctx)

        # the object explanation.
        self.explanation = None  # type: Optional[str]

        # --- internal ---

        self._exhibits_traits = CdmTraitCollection(ctx, self)  # type: CdmTraitCollection
        self._TAG = 'CdmObjectDefinition'

    @property
    def exhibits_traits(self) -> 'CdmTraitCollection':
        return self._exhibits_traits

    def _construct_resolved_traits_def(self, base: Optional['CdmObjectReference'], rtsb: 'ResolvedTraitSetBuilder',
                                       res_opt: 'ResolveOptions') -> None:
        if base:
            # merge in all from base class
            rtsb.merge_traits(base._fetch_resolved_traits(res_opt))

        # merge in any that are exhibited by this class
        if self.exhibits_traits:
            for et in self.exhibits_traits:
                rtsb.merge_traits(et._fetch_resolved_traits(res_opt))

    def _copy_def(self, res_opt: 'ResolveOptions', copy: 'CdmObjectDefinition') -> None:
        copy.ctx = self.ctx
        copy._declared_path = self._declared_path
        copy.explanation = self.explanation
        copy.exhibits_traits.clear()
        for trait in self.exhibits_traits:
            copy.exhibits_traits.append(trait)
        copy.in_document = self.in_document  # if gets put into a new document, this will change. until, use the source

    def create_simple_reference(self, res_opt: 'ResolveOptions') -> 'CdmObjectReference':
        from .cdm_corpus_def import CdmCorpusDefinition
        res_opt = res_opt if res_opt is not None else ResolveOptions(self, self.ctx.corpus.default_resolution_directives)
        name = self._declared_path or self.get_name()
        ref = self.ctx.corpus.make_object(CdmCorpusDefinition._map_reference_type(self.object_type), name, True)  # type: CdmObjectReference
        if res_opt._save_resolutions_on_copy:
            # Used to localize references between documents.
            ref.explicit_reference = self
            ref.in_document = self.in_document

        return ref

    def _create_portable_reference(self, res_opt: 'ResolveOptions') -> Optional['CdmObjectReference']:
        """
        Creates a 'portable' reference object to this object. portable means there is no symbolic name set until this reference is placed
        into some final document.
        """
        from .cdm_corpus_def import CdmCorpusDefinition
        cdm_object_ref = self.ctx.corpus.make_object(CdmCorpusDefinition._map_reference_type(self.object_type), 'portable', True)  # type: CdmObjectReference
        cdm_object_ref._portable_reference = self
        cdm_object_ref.in_document = self.in_document
        cdm_object_ref.owner = self.owner # where it started life

        return cdm_object_ref


    def fetch_object_definition_name(self) -> str:
        return self.get_name()

    def fetch_object_definition(self, res_opt: Optional['ResolveOptions'] = None) -> 'CdmObjectDefinition':
        """Returns the resolved object reference."""
        if res_opt is None:
            res_opt = ResolveOptions(self, self.ctx.corpus.default_resolution_directives)
        return self

    def _fetch_declared_path(self, path_from: str) -> str:
        """Given an initial path, returns this object's declared path"""
        name = self.get_name()
        return path_from + (name if name is not None else '')

    def _is_derived_from_def(self, res_opt: 'ResolveOptions', base: 'CdmObjectReference', name: str, seek: str) -> bool:
        if seek == name:
            return True

        definition = base.fetch_object_definition(res_opt) if base else None

        # detects a direct definition cycle, doesn't work for cases like A->B->A.
        if definition is self:
            logger.error(self.ctx, self._TAG, '_is_derived_from_def', self.at_corpus_path, CdmLogCode.ERR_CYCLE_IN_OBJECT_DEFINITION)
            return True

        if definition:
            return definition.is_derived_from(seek, res_opt)

        return False

    def _visit_def(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        return bool(self.exhibits_traits) and self._exhibits_traits._visit_array(path_from + '/exhibitsTraits/', pre_children, post_children)

    @abstractmethod
    def get_name(self) -> str:
        raise NotImplementedError()
