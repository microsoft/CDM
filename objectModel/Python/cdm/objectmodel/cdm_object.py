# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import abc
from threading import Lock
from typing import cast, Dict, Iterable, Optional, TYPE_CHECKING

from cdm.enums import CdmObjectType

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmDocumentDefinition
    from cdm.resolvedmodel import ResolvedTraitSet, ResolvedTraitSetBuilder
    from cdm.utilities import AttributeContextParameters, FriendlyFormatNode, ResolveOptions


class CdmObject(abc.ABC):
    _next_id_counter = 0
    _next_id_lock = Lock()

    def __init__(self, ctx: 'CdmCorpusContext') -> None:
        # The object ID.
        self.id = CdmObject._next_id()

        # The object context.
        self.ctx = ctx

        # The object that owns or contains this object.
        self.owner = None  # type: Optional[CdmObject]

        self.in_document = None  # type: Optional[CdmDocumentDefinition]

        # internal
        self._declared_path = None  # type: Optional[str]
        self._resolving_attributes = False  # type: bool
        self._resolving_traits = False  # type: bool
        self._trait_cache = None  # type: Optional[Dict[str, ResolvedTraitSetBuilder]]
        self._at_corpus_path = None  # type: Optional[str]

    @property
    def at_corpus_path(self) -> Optional[str]:
        if self.in_document is None:
            return 'NULL:/NULL/{}'.format(self._declared_path)

        return '{}/{}'.format(self.in_document.at_corpus_path, self._declared_path)

    @property
    @abc.abstractmethod
    def object_type(self) -> 'CdmObjectType':
        """the object type."""
        raise NotImplementedError()

    @abc.abstractmethod
    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmObject'] = None) -> 'CdmObject':
        """Creates a copy of this object.
            host: For CDM internal use. Copies the object INTO the provided host instead of creating a new object instance.
        """
        raise NotImplementedError()

    @abc.abstractmethod
    def create_simple_reference(self, res_opt: 'ResolveOptions') -> Optional['CdmObjectReference']:
        raise NotImplementedError()

    @abc.abstractmethod
    def fetch_object_definition(self, res_opt: 'ResolveOptions') -> Optional['CdmObjectDefinition']:
        """Returns the resolved object reference."""
        raise NotImplementedError()

    @abc.abstractmethod
    def fetch_object_definition_name(self) -> Optional[str]:
        raise NotImplementedError()

    @abc.abstractmethod
    def is_derived_from(self, base: str, res_opt: Optional['ResolveOptions'] = None) -> bool:
        raise NotImplementedError()

    @abc.abstractmethod
    def validate(self) -> bool:
        raise NotImplementedError()

    @abc.abstractmethod
    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        raise NotImplementedError()

    # Internal

    def _clear_trait_cache(self) -> None:
        self._trait_cache = None

    def _construct_resolved_attributes(self, res_opt: 'ResolveOptions', under: Optional['CdmAttributeContext'] = None) -> 'ResolvedAttributeSetBuilder':
        raise NotImplementedError('Not implemented in type {}'.format(self.__class__.__name__))

    def _construct_resolved_traits(self, rtsb: 'ResolvedTraitSetBuilder', res_opt: 'ResolveOptions') -> None:
        raise NotImplementedError('Not implemented in type {}'.format(self.__class__.__name__))

    def _fetch_resolved_attributes(self, res_opt: 'ResolveOptions', acp_in_context: Optional['AttributeContextParameters'] = None) -> 'ResolvedAttributeSet':
        from cdm.resolvedmodel import ResolvedAttributeSet
        from cdm.utilities import SymbolSet

        from .cdm_attribute_context import CdmAttributeContext
        from .cdm_corpus_def import CdmCorpusDefinition

        was_previously_resolving = self.ctx.corpus._is_currently_resolving
        self.ctx.corpus._is_currently_resolving = True
        if not res_opt:
            res_opt = ResolveOptions(self)

        kind = 'rasb'
        ctx = self.ctx
        cache_tag = ctx.corpus._fetch_definition_cache_tag(res_opt, self, kind, 'ctx' if acp_in_context else '')
        rasb_cache = ctx._cache.get(cache_tag) if cache_tag else None
        under_ctx = None

        # store the previous symbol set, we will need to add it with
        # children found from the constructResolvedTraits call
        curr_sym_ref_set = res_opt._symbol_ref_set or SymbolSet()
        res_opt._symbol_ref_set = SymbolSet()

        # get the moniker that was found and needs to be appended to all
        # refs in the children attribute context nodes
        from_moniker = res_opt._from_moniker
        res_opt._from_moniker = None

        if not rasb_cache:
            if self._resolving_attributes:
                # re-entered self attribute through some kind of self or looping reference.
                self.ctx.corpus._is_currently_resolving = was_previously_resolving
                return ResolvedAttributeSet()
            self._resolving_attributes = True

            # if a new context node is needed for these attributes, make it now
            if acp_in_context:
                under_ctx = CdmAttributeContext._create_child_under(res_opt, acp_in_context)

            rasb_cache = self._construct_resolved_attributes(res_opt, under_ctx)

            if rasb_cache:

                self._resolving_attributes = False

                # register set of possible docs
                odef = self.fetch_object_definition(res_opt)
                if odef is not None:
                    ctx.corpus._register_definition_reference_symbols(odef, kind, res_opt._symbol_ref_set)

                    # get the new cache tag now that we have the list of symbols
                    cache_tag = ctx.corpus._fetch_definition_cache_tag(res_opt, self, kind, 'ctx' if acp_in_context else '')
                    # save this as the cached version
                    if cache_tag:
                        ctx._cache[cache_tag] = rasb_cache

                    if from_moniker and acp_in_context and cast('CdmObjectReference', self).named_reference:
                        # create a fresh context
                        old_context = acp_in_context._under.contents[-1]
                        acp_in_context._under.contents.pop(len(acp_in_context._under.contents) - 1)
                        under_ctx = CdmAttributeContext._create_child_under(res_opt, acp_in_context)

                        old_context._copy_attribute_context_tree(res_opt, under_ctx, rasb_cache.ras, None, from_moniker)
        else:
            # get the SymbolSet for this cached object and pass that back
            key = CdmCorpusDefinition._fetch_cache_key_from_object(self, kind)
            res_opt._symbol_ref_set = ctx.corpus._definition_reference_symbols.get(key)

            # cache found. if we are building a context, then fix what we got instead of making a new one
            if acp_in_context:
                # make the new context
                under_ctx = CdmAttributeContext._create_child_under(res_opt, acp_in_context)

                rasb_cache.ras.attribute_context._copy_attribute_context_tree(res_opt, under_ctx, rasb_cache.ras, None, from_moniker)

        # merge child reference symbols set with current
        curr_sym_ref_set._merge(res_opt._symbol_ref_set)
        res_opt._symbol_ref_set = curr_sym_ref_set

        self.ctx.corpus._is_currently_resolving = was_previously_resolving
        return rasb_cache.ras if rasb_cache else rasb_cache

    def _fetch_resolved_traits(self, res_opt: 'ResolveOptions') -> 'ResolvedTraitSet':
        from cdm.resolvedmodel import ResolvedTraitSet, ResolvedTraitSetBuilder
        from cdm.utilities import SymbolSet

        was_previously_resolving = self.ctx.corpus._is_currently_resolving
        self.ctx.corpus._is_currently_resolving = True
        if not res_opt:
            res_opt = ResolveOptions(self)

        kind = 'rtsb'
        ctx = self.ctx
        cache_tag_a = ctx.corpus._fetch_definition_cache_tag(res_opt, self, kind)
        rtsb_all = None  # type: ResolvedTraitSetBuilder
        if self._trait_cache is None:
            self._trait_cache = {}
        elif cache_tag_a:
            rtsb_all = self._trait_cache.get(cache_tag_a)

        # store the previous document set, we will need to add it with
        # children found from the constructResolvedTraits call
        curr_doc_ref_set = res_opt._symbol_ref_set
        if curr_doc_ref_set is None:
            curr_doc_ref_set = SymbolSet()
        res_opt._symbol_ref_set = SymbolSet()

        if rtsb_all is None:
            rtsb_all = ResolvedTraitSetBuilder()

            if not self._resolving_traits:
                self._resolving_traits = True
                self._construct_resolved_traits(rtsb_all, res_opt)
                self._resolving_traits = False

            obj_def = self.fetch_object_definition(res_opt)
            if obj_def:
                # register set of possible docs
                ctx.corpus._register_definition_reference_symbols(obj_def, kind, res_opt._symbol_ref_set)

                if rtsb_all.resolved_trait_set is None:
                    # nothing came back, but others will assume there is a set in this builder
                    rtsb_all.resolved_trait_set = ResolvedTraitSet(res_opt)

                # get the new cache tag now that we have the list of docs
                cache_tag_a = ctx.corpus._fetch_definition_cache_tag(res_opt, self, kind)
                if cache_tag_a:
                    self._trait_cache[cache_tag_a] = rtsb_all
        else:
            # cache was found
            # get the SymbolSet for this cached object
            from .cdm_corpus_def import CdmCorpusDefinition
            key = CdmCorpusDefinition._fetch_cache_key_from_object(self, kind)
            temp_doc_ref_set = ctx.corpus._definition_reference_symbols.get(key)
            res_opt._symbol_ref_set = temp_doc_ref_set

        # merge child document set with current
        curr_doc_ref_set._merge(res_opt._symbol_ref_set)
        res_opt._symbol_ref_set = curr_doc_ref_set

        self.ctx.corpus._is_currently_resolving = was_previously_resolving
        return rtsb_all.resolved_trait_set

    @staticmethod
    def _copy_resolve_options(res_opt: 'ResolveOptions') -> 'ResolveOptions':
        from cdm.utilities import ResolveOptions  # pylint: disable=redefined-outer-name
        res_opt_copy = ResolveOptions()
        res_opt_copy.wrt_doc = res_opt.wrt_doc
        res_opt_copy._relationship_depth = res_opt._relationship_depth
        res_opt_copy._localize_references_for = res_opt._localize_references_for
        res_opt_copy._indexing_doc = res_opt._indexing_doc
        res_opt_copy.shallow_validation = res_opt.shallow_validation
        res_opt_copy._resolved_attribute_limit = res_opt._resolved_attribute_limit

        if res_opt.directives:
            res_opt_copy.directives = res_opt.directives.copy()

        return res_opt_copy

    @staticmethod
    def _next_id():
        with CdmObject._next_id_lock:
            CdmObject._next_id_counter += 1
            return CdmObject._next_id_counter

    @staticmethod
    def _resolved_trait_to_trait_ref(res_opt: 'ResolveOptions', rt: 'ResolvedTrait') -> 'CdmTraitReference':
        trait_ref = None  # type: CdmTraitReference
        if rt.parameter_values:
            trait_ref = rt.trait.ctx.corpus.make_object(CdmObjectType.TRAIT_REF, rt.trait_name, False)
            l = rt.parameter_values.length
            if l == 1:
                # just one argument, use the shortcut syntax.
                val = rt.parameter_values.values[0]
                if val is not None:
                    trait_ref.arguments.append(None, val)
            else:
                for idx in range(l):
                    param = rt.parameter_values.fetch_parameter_at_index(idx)
                    val = rt.parameter_values.values[idx]
                    if val is not None:
                        trait_ref.arguments.append(param.name, val)
        else:
            trait_ref = rt.trait.ctx.corpus.make_object(CdmObjectType.TRAIT_REF, rt.trait_name, True)

        if res_opt._save_resolutions_on_copy:
            # used to localize references between documents.
            trait_ref.explicit_reference = rt.trait
            trait_ref.in_document = rt.trait.in_document

        # always make it a property when you can, however the dataFormat traits should be left alone
        if rt.trait.associated_properties and not rt.trait.is_derived_from('is.dataFormat', res_opt):
            trait_ref.is_from_property = True

        return trait_ref

    @staticmethod
    def _visit_array(items: Iterable['CdmObject'], path: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        result = False
        for item in (items or []):
            if item:
                if item.visit(path, pre_children, post_children):
                    result = True
                    break
        return result
