# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from abc import abstractmethod
from typing import Optional, Union, TYPE_CHECKING

from cdm.enums import CdmObjectType

from .cdm_collection import CdmCollection
from .cdm_object import CdmObject
from .cdm_object_ref import CdmObjectReference
from .cdm_trait_collection import CdmTraitCollection

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmTraitDefinition, CdmTraitReference
    from cdm.resolvedmodel import ResolvedTraitSetBuilder
    from cdm.utilities import FriendlyFormatNode, ResolveOptions, VisitCallback


class CdmObjectDefinition(CdmObject):
    def __init__(self, ctx: 'CdmCorpusContext') -> None:
        super().__init__(ctx)

        # the object explanation.
        self.explanation = None  # type: Optional[str]

        # --- internal ---

        self._exhibits_traits = CdmTraitCollection(ctx, self)  # type: CdmTraitCollection

    @property
    def exhibits_traits(self) -> 'CdmTraitCollection':
        return self._exhibits_traits

    def _construct_resolved_traits_def(self, base: 'CdmObjectReference', rtsb: 'ResolvedTraitSetBuilder', res_opt: 'ResolveOptions') -> None:
        if base:
            # merge in all from base class
            rtsb.merge_traits(base._fetch_resolved_traits(res_opt))

        # merge in any that are exhibited by this class
        if self.exhibits_traits:
            for et in self.exhibits_traits:
                rtsb.merge_traits(et._fetch_resolved_traits(res_opt))

    def _copy_def(self, res_opt: 'ResolveOptions', copy: 'CdmObjectDefinition') -> None:
        copy._declared_path = self._declared_path
        copy.explanation = self.explanation
        copy.exhibits_traits.clear()
        for trait in self.exhibits_traits:
            copy.exhibits_traits.append(trait)

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

    def fetch_object_definition_name(self) -> str:
        return self.get_name()

    def fetch_object_definition(self, res_opt: 'ResolveOptions') -> 'CdmObjectDefinition':
        """Returns the resolved object reference."""
        return self

    def _is_derived_from_def(self, res_opt: 'ResolveOptions', base: 'CdmObjectReference', name: str, seek: str) -> bool:
        if seek == name:
            return True

        definition = base.fetch_object_definition(res_opt) if base else None
        if base and definition:
            return definition.is_derived_from(seek, res_opt)

        return False

    def _visit_def(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        return bool(self.exhibits_traits) and self._exhibits_traits._visit_array(path_from + '/exhibitsTraits/', pre_children, post_children)

    @abstractmethod
    def get_name(self) -> str:
        raise NotImplementedError()
