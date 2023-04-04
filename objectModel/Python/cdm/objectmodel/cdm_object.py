# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import math
import abc
from threading import Lock
from typing import List, cast, Dict, Iterable, Optional, TYPE_CHECKING
from cdm.resolvedmodel import TraitProfile, TraitProfileCache

from cdm.enums import CdmObjectType

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmDocumentDefinition, CdmEntityAttributeDefinition, \
            CdmAttributeContext, CdmObjectDefinition, CdmObjectReference, CdmTraitCollection, \
            CdmTraitDefinition, CdmTraitGroupReference, CdmTraitReference
    from cdm.resolvedmodel import ResolvedAttributeSet, ResolvedAttributeSetBuilder, ResolvedTrait, \
        ResolvedTraitSet, ResolvedTraitSetBuilder, TraitProfile, TraitProfileCache
    from cdm.utilities import AttributeContextParameters, ResolveOptions,VisitCallback


class CdmObject(abc.ABC):
    _next_id_counter = 0
    _next_id_lock = Lock()

    # The minimum json semantic versions that can be loaded by this ObjectModel version.
    json_schema_semantic_version_minimum_load = '1.0.0'
    # The minimum json semantic versions that can be saved by this ObjectModel version.
    json_schema_semantic_version_minimum_save = '1.1.0'
    # The maximum json semantic versions that can be loaded and saved by this ObjectModel version.
    json_schema_semantic_version_maximum_save_load = '1.5.0'

    # known semantic versions changes
    json_schema_semantic_version_projections = "1.4.0"
    json_schema_semantic_version_traits_on_traits = "1.5.0"

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
        self._resolving_traits = False  # type: bool
        self._trait_cache = None  # type: Optional[Dict[str, ResolvedTraitSetBuilder]]
        self._at_corpus_path = None  # type: Optional[str]

    @property
    def at_corpus_path(self) -> Optional[str]:
        if self.in_document is None:
            return 'NULL:/NULL/{}'.format(self._declared_path if self._declared_path else '')

        return '{}/{}'.format(self.in_document.at_corpus_path, self._declared_path if self._declared_path else '')

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
    def _create_portable_reference(self, res_opt: 'ResolveOptions') -> Optional['CdmObjectReference']:
        raise NotImplementedError()

    @abc.abstractmethod
    def fetch_object_definition(self, res_opt: Optional['ResolveOptions'] = None) -> Optional['CdmObjectDefinition']:
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


    # returns a list of TraitProfile descriptions, one for each trait applied to or exhibited by this object.
    # each description of a trait is an expanded picture of a trait reference.
    # the goal of the profile is to make references to structured, nested, messy traits easier to understand and compare.
    # we do this by promoting and merging some information as far up the trait inheritance / reference chain as far as we can without 
    # giving up important meaning.
    # in general, every trait profile includes:
    # 1. the name of the trait
    # 2. a TraitProfile for any trait that this trait may 'extend', that is, a base class trait
    # 3. a map of argument / parameter values that have been set
    # 4. an applied 'verb' trait in the form of a TraitProfile
    # 5. an array of any "classifier" traits that have been applied
    # 6. and array of any other (non-classifier) traits that have been applied or exhibited by this trait
    # 
    # adjustments to these ideas happen as trait information is 'bubbled up' from base definitons. adjustments include
    # 1. the most recent verb trait that was defined or applied will propigate up the hierarchy for all references even those that do not specify a verb. 
    # This ensures the top trait profile depicts the correct verb
    # 2. traits that are applied or exhibited by another trait using the 'classifiedAs' verb are put into a different collection called classifiers.
    # 3. classifiers are accumulated and promoted from base references up to the final trait profile. this way the top profile has a complete list of classifiers 
    # but the 'deeper' profiles will not have the individual classifications set (to avoid an explosion of info)
    # 3. In a similar way, trait arguments will accumulate from base definitions and default values. 
    # 4. traits used as 'verbs' (defaultVerb or explicit verb) will not include classifier descriptions, this avoids huge repetition of somewhat pointless info and recursive effort
    def fetch_trait_profiles(self, res_opt: Optional['ResolveOptions'] = None, cache:  Optional['TraitProfileCache'] = None, forVerb: Optional[str] = None)-> List['TraitProfile']:
        from cdm.objectmodel import CdmAttributeItem, CdmObjectDefinition, CdmObjectReference, CdmTraitReference, CdmTraitDefinition, CdmTraitGroupReference

        if not cache:
            cache = TraitProfileCache()

        if not res_opt:
            # resolve symbols with default directive and WRTDoc from this object's point of view
            res_opt = ResolveOptions(self, self.ctx.corpus.default_resolution_directives)

        result = [] # type: List['TraitProfile']
        traits = None #type: CdmTraitCollection
        prof = None # type: TraitProfile
        if isinstance(self, CdmAttributeItem):
            traits = cast(CdmAttributeItem, self).applied_traits
        elif isinstance(self, CdmTraitDefinition):
            prof = TraitProfile._trait_def_to_profile(cast(CdmTraitDefinition, self), res_opt, False, False, cache)
        elif isinstance(self, CdmObjectDefinition):
            traits = cast(CdmObjectDefinition, self).exhibits_traits
        elif isinstance(self, CdmTraitReference):
            prof = TraitProfile._trait_ref_to_profile(cast(CdmTraitReference, self), res_opt, False, False, True, cache)
        elif isinstance(self, CdmTraitGroupReference):
            prof = TraitProfile._trait_ref_to_profile(cast(CdmTraitGroupReference, self), res_opt, False, False, True, cache)
        elif isinstance(self, CdmObjectReference):
            traits = cast(CdmObjectReference, self).applied_traits
        
        #one of these two will happen
        if prof:
            if (not prof.verb) or (not forVerb) or prof.verb.trait_name == forVerb:
                result.append(prof)
        if traits:
            for tr in traits:
                prof = TraitProfile._trait_ref_to_profile(tr, res_opt, False, False, True, cache)
                if prof:
                    if (not prof.verb) or (not forVerb) or prof.verb.trait_name == forVerb:
                        result.append(prof)

        if len(result) == 0:
            result = None

        return result

    # Internal

    def _clear_trait_cache(self) -> None:
        self._trait_cache = None

    def _construct_resolved_attributes(self, res_opt: 'ResolveOptions', under: Optional['CdmAttributeContext'] = None) -> 'ResolvedAttributeSetBuilder':
        raise NotImplementedError('Not implemented in type {}'.format(self.__class__.__name__))

    def _construct_resolved_traits(self, rtsb: 'ResolvedTraitSetBuilder', res_opt: 'ResolveOptions') -> None:
        raise NotImplementedError('Not implemented in type {}'.format(self.__class__.__name__))

    def _fetch_object_from_cache(self, res_opt: 'ResolveOptions', acp_in_context: Optional['AttributeContextParameters']) -> 'ResolvedAttributeSet':
        kind = 'rasb'
        ctx = self.ctx
        cache_tag = ctx.corpus._create_definition_cache_tag(res_opt, self, kind, 'ctx' if acp_in_context else '')
        return ctx._attribute_cache.get(cache_tag) if cache_tag else None

    def _fetch_resolved_attributes(self, res_opt: 'ResolveOptions', acp_in_context: Optional['AttributeContextParameters'] = None) -> 'ResolvedAttributeSet':
        from cdm.resolvedmodel import ResolvedAttributeSet
        from cdm.utilities import SymbolSet

        from .cdm_attribute_context import CdmAttributeContext
        from .cdm_corpus_def import CdmCorpusDefinition
        from .cdm_entity_attribute_def import CdmEntityAttributeDefinition
        from .cdm_entity_def import CdmEntityDefinition
        from cdm.resolvedmodel.resolved_attribute_set_builder import ResolvedAttributeSetBuilder

        was_previously_resolving = self.ctx.corpus._is_currently_resolving
        self.ctx.corpus._is_currently_resolving = True
        if not res_opt:
            res_opt = ResolveOptions(self, self.ctx.corpus.default_resolution_directives)

        in_circular_reference = False
        was_in_circular_reference = res_opt._in_circular_reference
        if isinstance(self, CdmEntityDefinition):
            in_circular_reference = self in res_opt._currently_resolving_entities
            res_opt._currently_resolving_entities.add(self)
            res_opt._in_circular_reference = in_circular_reference

            # uncomment this line as a test to turn off allowing cycles
            #if in_circular_reference:
            #    return ResolvedAttributeSet()

        current_depth = res_opt._depth_info.current_depth

        kind = 'rasb'
        ctx = self.ctx
        rasb_result = None
        rasb_cache = self._fetch_object_from_cache(res_opt, acp_in_context)  # type: Optional[ResolvedAttributeSetBuilder]
        under_ctx = None

        # store the previous symbol set, we will need to add it with
        # children found from the constructResolvedTraits call
        curr_sym_ref_set = res_opt._symbol_ref_set or SymbolSet()
        res_opt._symbol_ref_set = SymbolSet()

        # if using the cache passes the maxDepth, we cannot use it
        if rasb_cache \
                and res_opt._depth_info.max_depth \
                and res_opt._depth_info.current_depth + rasb_cache._resolved_attribute_set._depth_traveled > res_opt._depth_info.max_depth:
            rasb_cache = None

        if not rasb_cache:
            # a new context node is needed for these attributes,
            # this tree will go into the cache, so we hang it off a placeholder parent
            # when it is used from the cache (or now), then this placeholder parent is ignored and the things under it are
            # put into the 'receiving' tree
            under_ctx = CdmAttributeContext._get_under_context_for_cache_context(res_opt, self.ctx, acp_in_context)

            rasb_cache = self._construct_resolved_attributes(res_opt, under_ctx)  # type: ResolvedAttributeSetBuilder

            if rasb_cache:
                # register set of possible docs
                o_def = self.fetch_object_definition(res_opt)
                if o_def is not None:
                    ctx.corpus._register_definition_reference_symbols(o_def, kind, res_opt._symbol_ref_set)

                    if self.object_type == CdmObjectType.ENTITY_DEF:
                        # if we just got attributes for an entity, take the time now to clean up this cached tree and prune out
                        # things that don't help explain where the final set of attributes came from
                        if under_ctx:
                            scopes_for_attributes = set()  # type: set[CdmAttributeContext]
                            under_ctx._collect_context_from_atts(rasb_cache._resolved_attribute_set, scopes_for_attributes)  # the context node for every final attribute
                            if not under_ctx._prune_to_scope(scopes_for_attributes):
                                return None

                    # get the new cache tag now that we have the list of docs 
                    cache_tag = ctx.corpus._create_definition_cache_tag(res_opt, self, kind, 'ctx' if acp_in_context else None)

                    # save this as the cached version
                    if cache_tag:
                        ctx._attribute_cache[cache_tag] = rasb_cache
                # get the 'under_ctx' of the attribute set from the acp that is wired into the target tree
                under_ctx = rasb_cache._resolved_attribute_set.attribute_context \
                    ._get_under_context_from_cache_context(res_opt, acp_in_context) \
                    if rasb_cache._resolved_attribute_set.attribute_context else None
        else:
            # get the 'under_ctx' of the attribute set from the cache. The one stored there was build with a different
            # acp and is wired into the fake placeholder. so now build a new under_ctx wired into the output tree but with
            # copies of all cached children
            under_ctx = rasb_cache \
                ._resolved_attribute_set.attribute_context \
                ._get_under_context_from_cache_context(res_opt, acp_in_context) \
                if rasb_cache._resolved_attribute_set.attribute_context else None
            # under_ctx._validate_lineage(res_opt)  # debugging

        if rasb_cache:
            # either just built something or got from cache
            # either way, same deal: copy resolved attributes and copy the context tree associated with it
            # 1. deep copy the resolved att set (may have groups) and leave the attCtx pointers set to the old tree
            # 2. deep copy the tree.
            #
            # 1. deep copy the resolved att set (may have groups) and leave the attCtx pointers set to the old tree
            rasb_result = ResolvedAttributeSetBuilder()
            rasb_result._resolved_attribute_set = rasb_cache._resolved_attribute_set.copy()

            # 2. deep copy the tree and map the context references.
            if under_ctx: # null context? means there is no tree, probably 0 attributes came out
                if not under_ctx.associate_tree_copy_with_attributes(res_opt, rasb_result._resolved_attribute_set):
                    return None

        if isinstance(self, CdmEntityAttributeDefinition):
            # if we hit the maxDepth, we are now going back up
            res_opt._depth_info.current_depth = current_depth
            # now at the top of the chain where max depth does not influence the cache
            if res_opt._depth_info.current_depth == 0:
                res_opt._depth_info.max_depth_exceeded = False

        if not in_circular_reference and self.object_type == CdmObjectType.ENTITY_DEF:
            # should be removed from the root level only
            # if it is in a circular reference keep it there
            res_opt._currently_resolving_entities.remove(self)

        res_opt._in_circular_reference = was_in_circular_reference

        # merge child reference symbols set with current
        curr_sym_ref_set._merge(res_opt._symbol_ref_set)
        res_opt._symbol_ref_set = curr_sym_ref_set

        self.ctx.corpus._is_currently_resolving = was_previously_resolving
        return rasb_result._resolved_attribute_set if rasb_result else rasb_result

    def _fetch_resolved_traits(self, res_opt: 'ResolveOptions') -> 'ResolvedTraitSet':
        from cdm.resolvedmodel import ResolvedTraitSet, ResolvedTraitSetBuilder
        from cdm.utilities import SymbolSet

        was_previously_resolving = self.ctx.corpus._is_currently_resolving
        self.ctx.corpus._is_currently_resolving = True
        if not res_opt:
            res_opt = ResolveOptions(self, self.ctx.corpus.default_resolution_directives)

        kind = 'rtsb'
        ctx = self.ctx
        cache_tag_a = ctx.corpus._create_definition_cache_tag(res_opt, self, kind)
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
                cache_tag_a = ctx.corpus._create_definition_cache_tag(res_opt, self, kind)
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
    def _protect_parameter_values(res_opt: 'ResolveOptions', val: 'CdmObject') -> 'CdmObject':
        from .cdm_entity_ref import CdmEntityReference
        from .cdm_constant_entity_def import CdmConstantEntityDefinition
        if val:
            # the value might be a constant entity object, need to protect the original
            c_ent = cast(CdmEntityReference, val).explicit_reference if isinstance(val, CdmEntityReference) else None
            if c_ent:
                # copy the constant entity AND the reference that holds it
                c_ent = cast(CdmConstantEntityDefinition, c_ent.copy(res_opt))
                val = cast(CdmEntityReference, val).copy(res_opt)
                cast(CdmEntityReference, val).explicit_reference = c_ent

        return val

    @staticmethod
    def _next_id():
        with CdmObject._next_id_lock:
            CdmObject._next_id_counter += 1
            return CdmObject._next_id_counter

    @staticmethod
    def _resolved_trait_to_trait_ref(res_opt: 'ResolveOptions', rt: 'ResolvedTrait') -> 'CdmTraitReference':
        trait_ref = None  # type: CdmTraitReference
        # if nothing extra needs a mention, make a simple string ref
        trait_ref = rt.trait.ctx.corpus.make_object(CdmObjectType.TRAIT_REF, rt.trait_name, not ((rt.parameter_values and rt.parameter_values.length > 0) or rt.explicit_verb or rt.meta_traits))
        if rt.parameter_values:
            l = rt.parameter_values.length
            if l == 1:
                # just one argument, use the shortcut syntax.
                val = CdmObject._protect_parameter_values(res_opt, rt.parameter_values.values[0])
                if val is not None:
                    trait_ref.arguments.append(None, val)
            else:
                for idx in range(l):
                    param = rt.parameter_values.fetch_parameter_at_index(idx)
                    val = CdmObject._protect_parameter_values(res_opt, rt.parameter_values.values[idx])
                    if val is not None:
                        trait_ref.arguments.append(param.name, val)

        if rt.explicit_verb:
            trait_ref.verb = rt.explicit_verb.copy(res_opt)
            trait_ref.verb.owner = trait_ref

        if rt.meta_traits:
            for trMeta in rt.meta_traits:
                trMetaCopy = trMeta.copy(res_opt)
                trait_ref.applied_traits.append(trMetaCopy)

        if res_opt._save_resolutions_on_copy:
            # used to localize references between documents.
            from cdm.objectmodel import CdmTraitDefinition
            trait_ref.explicit_reference = cast(CdmTraitDefinition, rt.trait)
            trait_ref.in_document = cast(CdmTraitDefinition, rt.trait).in_document

        # always make it a property when you can, however the dataFormat traits should be left alone
        # also the wellKnown is the first constrained list that uses the datatype to hold the table instead of the default value property.
        # so until we figure out how to move the enums away from default value, show that trait too
        if rt.trait.associated_properties \
                and not rt.trait.is_derived_from('is.dataFormat', res_opt)\
                and not rt.trait.trait_name == 'is.constrainedList.wellKnown':
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

    @staticmethod
    def semantic_version_string_to_number(version: str) -> int:
        # converts a string in the form MM.mm.pp into a single comparable long integer
        #limited to 3 parts where each part is 5 numeric digits or fewer
        # returns -1 if failure
        
        if not version:
            return -1
        
        # must have the three parts
        semantic_version_split = version.split('.')
        if len(semantic_version_split) != 3:
            return -1
        
        # accumulate the result
        num_ver = 0
        for i in range(3):
            ver_part = 0
            try:
                ver_part = int(semantic_version_split[i])
            except ValueError:
                return -1
        
            # 6 digits?
            if ver_part > 100000:
                return -1
        
            # shift the previous accumulation over 5 digits and add in the new part
            num_ver *= 100000
            num_ver += ver_part
        return num_ver

    @staticmethod
    def semantic_version_number_to_string(version: int) -> str:
        # converts a number encoding 3 version parts into a string in the form MM.mm.pp
        # assumes 5 digits per encoded version part
        verPartM = math.floor(version / (100000 * 100000))
        version = version - (verPartM * (100000 * 100000))
        verPartm = math.floor(version / 100000)
        verPartP = version - (verPartm * 100000)
        return str(verPartM) + '.' + str(verPartm) + '.' + str(verPartP) 

        
    def _get_minimum_semantic_version(self) -> int:
        return CdmObject.default_json_schema_semantic_version_number

CdmObject.default_json_schema_semantic_version_number = CdmObject.semantic_version_string_to_number(CdmObject.json_schema_semantic_version_minimum_save)


