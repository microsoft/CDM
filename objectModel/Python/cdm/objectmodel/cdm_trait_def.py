# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional, List, TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.resolvedmodel import ParameterCollection
from cdm.utilities import ResolveOptions, logger
from cdm.enums import CdmLogCode

from .cdm_object_def import CdmObjectDefinition
from .cdm_collection import CdmCollection

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmTraitReference, CdmParameterDefinition
    from cdm.utilities import VisitCallback


class CdmTraitDefinition(CdmObjectDefinition):
    """Help in expressing semantic meaning and structural guidance."""

    def __init__(self, ctx: 'CdmCorpusContext', name: str, extends_trait: Optional['CdmTraitReference'] = None) -> None:
        super().__init__(ctx)

        self._TAG = CdmTraitDefinition.__name__

        # the trait associated properties.
        self.associated_properties = []  # type: List[str]

        # the trait elevated.
        self.elevated = None  # type: Optional[bool]

        # the trait extended by this trait.
        self.extends_trait = extends_trait  # type: Optional[CdmTraitReference]

        # the trait name.
        self.trait_name = name  # type: str

        # if trait is user facing or not.
        self.ugly = None  # type: Optional[bool]

        # internal

        self._this_is_known_to_have_parameters = None
        self._base_is_known_to_have_parameters = None
        self._has_set_flags = False
        self._all_parameters = None
        self._parameters = None

    @property
    def parameters(self) -> 'CdmCollection[CdmParameterDefinition]':
        if self._parameters is None:
            self._parameters = CdmCollection(self.ctx, self, CdmObjectType.PARAMETER_DEF)

        return self._parameters

    @property
    def object_type(self) -> CdmObjectType:
        return CdmObjectType.TRAIT_DEF

    def _construct_resolved_traits(self, rtsb: 'ResolvedTraitSetBuilder', res_opt: 'ResolveOptions') -> None:
        # Traits don't have traits.
        pass

    def _construct_resolved_attributes(self, res_opt: 'ResolveOptions', under: 'CdmAttributeContext' = None) -> None:
        return None

    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmTraitDefinition'] = None) -> 'CdmTraitDefinition':
        if not res_opt:
            res_opt = ResolveOptions(wrt_doc=self, directives=self.ctx.corpus.default_resolution_directives)

        if not host:
            copy = CdmTraitDefinition(self.ctx, self.trait_name, None)
        else:
            copy = host
            copy.trait_name = self.trait_name

        if self.extends_trait:
            copy.extends_trait = self.extends_trait.copy(res_opt)

        copy._all_parameters = None
        copy.elevated = self.elevated
        copy.ugly = self.ugly
        copy.associated_properties = list(self.associated_properties) if self.associated_properties else None

        self._copy_def(res_opt, copy)
        return copy

    def get_name(self):
        return self.trait_name

    def _fetch_resolved_traits(self, res_opt: 'ResolveOptions') -> 'ResolvedTraitSet':
        from cdm.resolvedmodel import ResolvedTrait, ResolvedTraitSet
        from cdm.utilities import SymbolSet

        from .cdm_corpus_def import CdmCorpusDefinition

        res_opt = res_opt if res_opt is not None else ResolveOptions(self, self.ctx.corpus.default_resolution_directives)

        kind = 'rtsb'
        ctx = self.ctx
        # this may happen 0, 1 or 2 times. so make it fast
        base_trait = None  # type: CdmTraitDefinition
        base_values = None  # type: List[CdmArgumentValue]

        def get_base_info(base_trait, base_values):
            if self.extends_trait:
                base_trait = self.extends_trait.fetch_object_definition(res_opt)
                if base_trait:
                    base_rts = self.extends_trait._fetch_resolved_traits(res_opt)
                    if base_rts and base_rts.size == 1:
                        base_pv = base_rts.get(base_trait).parameter_values if base_rts.get(base_trait) else None
                        if base_pv:
                            base_values = base_pv.values

            return base_trait, base_values

        # see if one is already cached
        # if this trait has parameters, then the base trait found through the reference might be a different reference
        # because trait references are unique per argument value set. so use the base as a part of the cache tag
        # since it is expensive to figure out the extra tag, cache that too!
        if self._base_is_known_to_have_parameters is None:
            base_trait, base_values = get_base_info(base_trait, base_values)
            # is a cache tag needed? then make one
            self._base_is_known_to_have_parameters = False
            if base_values:
                self._base_is_known_to_have_parameters = True

        cache_tag_extra = ''
        if self._base_is_known_to_have_parameters:
            cache_tag_extra = str(self.extends_trait.id)

        cache_tag = ctx.corpus._create_definition_cache_tag(res_opt, self, kind, cache_tag_extra)
        rts_result = ctx._trait_cache.get(cache_tag) if cache_tag else None

        # store the previous reference symbol set, we will need to add it with
        # children found from the _construct_resolved_traits call
        curr_sym_ref_set = res_opt._symbol_ref_set or SymbolSet()
        res_opt._symbol_ref_set = SymbolSet()

        # if not, then make one and save it
        if not rts_result:
            base_trait, base_values = get_base_info(base_trait, base_values)
            if base_trait:
                # get the resolution of the base class and use the values as a starting point for this trait's values
                if not self._has_set_flags:
                    # inherit these flags
                    if self.elevated is None:
                        self.elevated = base_trait.elevated
                    if self.ugly is None:
                        self.ugly = base_trait.ugly
                    if self.associated_properties is None:
                        self.associated_properties = base_trait.associated_properties

            self._has_set_flags = True
            parameter_collection = self._fetch_all_parameters(res_opt)
            argument_values = []  # type: List[CdmArgumentValue]
            was_set = []  # type: List[bool]

            self._this_is_known_to_have_parameters = bool(parameter_collection.sequence)
            for i in range(len(parameter_collection.sequence)):
                # either use the default value or (higher precidence) the value taken from the base reference
                value = parameter_collection.sequence[i].default_value
                if base_values and i < len(base_values):
                    base_value = base_values[i]
                    if base_value:
                        value = base_value
                argument_values.append(value)
                was_set.append(False)

            # save it
            res_trait = ResolvedTrait(self, parameter_collection, argument_values, was_set)
            rts_result = ResolvedTraitSet(res_opt)
            rts_result.merge(res_trait, False)

            # register set of possible symbols
            ctx.corpus._register_definition_reference_symbols(self.fetch_object_definition(res_opt), kind, res_opt._symbol_ref_set)
            # get the new cache tag now that we have the list of docs
            cache_tag = ctx.corpus._create_definition_cache_tag(res_opt, self, kind, cache_tag_extra)
            if cache_tag:
                ctx._trait_cache[cache_tag] = rts_result
        else:
            # cache found
            # get the SymbolSet for this cached object
            key = CdmCorpusDefinition._fetch_cache_key_from_object(self, kind)
            res_opt._symbol_ref_set = ctx.corpus._definition_reference_symbols.get(key)

        # merge child document set with current
        curr_sym_ref_set._merge(res_opt._symbol_ref_set)
        res_opt._symbol_ref_set = curr_sym_ref_set

        return rts_result

    def is_derived_from(self, base: str, res_opt: Optional['ResolveOptions'] = None) -> bool:
        res_opt = res_opt if res_opt is not None else ResolveOptions(self, self.ctx.corpus.default_resolution_directives)
        if base == self.trait_name:
            return True
        return self._is_derived_from_def(res_opt, self.extends_trait, self.trait_name, base)

    def validate(self) -> bool:
        if not bool(self.trait_name):
            missing_fields = ['trait_name']
            logger.error(self.ctx, self._TAG, 'validate', self.at_corpus_path, CdmLogCode.ERR_VALDN_INTEGRITY_CHECK_FAILURE, self.at_corpus_path, ', '.join(map(lambda s: '\'' + s + '\'', missing_fields)))
            return False
        return True

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        path = self._fetch_declared_path(path_from)

        if pre_children and pre_children(self, path):
            return False

        if self.extends_trait:
            self.extends_trait.owner = self
            if self.extends_trait.visit('{}/extendsTrait/'.format(path), pre_children, post_children):
                return True

        if self.parameters and self.parameters._visit_array('{}/hasParameters/'.format(path), pre_children, post_children):
            return True

        if post_children and post_children(self, path):
            return True

        return False

    def _fetch_all_parameters(self, res_opt: 'ResolveOptions') -> ParameterCollection:
        if self._all_parameters:
            return self._all_parameters

        # Get parameters from base if there is one
        prior = None
        if self.extends_trait:
            prior = self.extends_trait.fetch_object_definition(res_opt)._fetch_all_parameters(res_opt)

        self._all_parameters = ParameterCollection(prior)
        if self.parameters:
            for paramter in self.parameters:
                self._all_parameters.add(paramter)

        return self._all_parameters
