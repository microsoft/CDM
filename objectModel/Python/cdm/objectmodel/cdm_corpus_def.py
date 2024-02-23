# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import asyncio
from collections import defaultdict, OrderedDict
from datetime import datetime
from typing import cast, Callable, Dict, List, Optional, Set, TypeVar, Union, TYPE_CHECKING, Tuple
import warnings

import nest_asyncio

from cdm.enums import CdmLogCode
from cdm.storage import StorageManager
from cdm.enums import CdmAttributeContextType, CdmObjectType, CdmStatusLevel, CdmValidationStep, ImportsLoadStrategy
from cdm.objectmodel import CdmContainerDefinition
from cdm.utilities import AttributeResolutionDirectiveSet, DocsResult, ImportInfo, ResolveOptions, \
    StorageUtils, SymbolSet, logger
from cdm.utilities.cdm_file_metadata import CdmFileMetadata

from .cdm_attribute_ref import CdmAttributeReference
from .cdm_corpus_context import CdmCorpusContext
from .cdm_document_def import CdmDocumentDefinition
from .cdm_entity_def import CdmEntityDefinition
from .cdm_e2e_relationship import CdmE2ERelationship
from .cdm_manifest_def import CdmManifestDefinition
from .cdm_object import CdmObject
from ._document_library import DocumentLibrary
from ..utilities.string_utils import StringUtils

if TYPE_CHECKING:
    from cdm.objectmodel import CdmTraitReference, CdmAttributeContext, CdmDocumentDefinition, \
        CdmManifestDefinition, CdmObject, CdmObjectDefinition, \
        CdmObjectReference, CdmTypeAttributeDefinition, CdmReferencedEntityDeclarationDefinition
    from cdm.resolvedmodel import ResolvedTraitSet
    from cdm.utilities import EventCallback, TelemetryClient

    TObject = TypeVar('TObject', bound=CdmObject)
    TObjectRef = TypeVar('TObjectRef', bound=CdmObjectReference)

SYMBOL_TYPE_CHECK = {
    CdmObjectType.TRAIT_REF: CdmObjectType.TRAIT_DEF,
    CdmObjectType.TRAIT_GROUP_REF: CdmObjectType.TRAIT_GROUP_DEF,
    CdmObjectType.DATA_TYPE_REF: CdmObjectType.DATA_TYPE_DEF,
    CdmObjectType.ENTITY_REF: CdmObjectType.ENTITY_DEF,
    CdmObjectType.PARAMETER_DEF: CdmObjectType.PARAMETER_DEF,
    CdmObjectType.PURPOSE_REF: CdmObjectType.PURPOSE_DEF,
    CdmObjectType.ATTRIBUTE_GROUP_REF: CdmObjectType.ATTRIBUTE_GROUP_DEF,
    CdmObjectType.PROJECTION_DEF: CdmObjectType.PROJECTION_DEF,
    CdmObjectType.OPERATION_ADD_COUNT_ATTRIBUTE_DEF: CdmObjectType.OPERATION_ADD_COUNT_ATTRIBUTE_DEF,
    CdmObjectType.OPERATION_ADD_SUPPORTING_ATTRIBUTE_DEF: CdmObjectType.OPERATION_ADD_SUPPORTING_ATTRIBUTE_DEF,
    CdmObjectType.OPERATION_ADD_TYPE_ATTRIBUTE_DEF: CdmObjectType.OPERATION_ADD_TYPE_ATTRIBUTE_DEF,
    CdmObjectType.OPERATION_EXCLUDE_ATTRIBUTES_DEF: CdmObjectType.OPERATION_EXCLUDE_ATTRIBUTES_DEF,
    CdmObjectType.OPERATION_ARRAY_EXPANSION_DEF: CdmObjectType.OPERATION_ARRAY_EXPANSION_DEF,
    CdmObjectType.OPERATION_COMBINE_ATTRIBUTES_DEF: CdmObjectType.OPERATION_COMBINE_ATTRIBUTES_DEF,
    CdmObjectType.OPERATION_RENAME_ATTRIBUTES_DEF: CdmObjectType.OPERATION_RENAME_ATTRIBUTES_DEF,
    CdmObjectType.OPERATION_REPLACE_AS_FOREIGN_KEY_DEF: CdmObjectType.OPERATION_REPLACE_AS_FOREIGN_KEY_DEF,
    CdmObjectType.OPERATION_INCLUDE_ATTRIBUTES_DEF: CdmObjectType.OPERATION_INCLUDE_ATTRIBUTES_DEF,
    CdmObjectType.OPERATION_ADD_ATTRIBUTE_GROUP_DEF: CdmObjectType.OPERATION_ADD_ATTRIBUTE_GROUP_DEF,
    CdmObjectType.OPERATION_ALTER_TRAITS_DEF: CdmObjectType.OPERATION_ALTER_TRAITS_DEF,
    CdmObjectType.OPERATION_ADD_ARTIFACT_ATTRIBUTE_DEF: CdmObjectType.OPERATION_ADD_ARTIFACT_ATTRIBUTE_DEF,
}


class CdmCorpusDefinition:

    def __init__(self):
        from cdm.persistence import PersistenceLayer

        self._TAG = CdmCorpusDefinition.__name__

        # the corpus root path.
        self.root_path = None  # type: Optional[str]

        self.ctx = CdmCorpusContext(self, None)

        # the app ID, optional property.
        self.app_id = None  # type: Optional[str]

        # The client for ingesting telemetry.
        self.telemetry_client = None  # type: Optional[TelemetryClient]

        # --- internal ---

        # whether we are currently performing a resolution or not.
        # used to stop making documents dirty during CdmCollections operations.
        self._is_currently_resolving = False  # type: bool

        # The set of resolution directives that will be used by default by the object model when it is resolving
        # entities and when no per-call set of directives is provided.
        self.default_resolution_directives = AttributeResolutionDirectiveSet(
            {'normalized', 'referenceOnly'})  # type: AttributeResolutionDirectiveSet

        self._symbol_definitions = {}  # type: Dict[str, List[CdmDocumentDefinition]]
        self._incoming_relationships = defaultdict(list)  # type: Dict[string, List[CdmE2ERelationship]]
        self._outgoing_relationships = defaultdict(list)  # type: Dict[string, List[CdmE2ERelationship]]
        self._definition_reference_symbols = {}  # type: Dict[str, SymbolSet]
        self._empty_rts = {}  # type: Dict[str, ResolvedTraitSet]
        self._document_library = DocumentLibrary(self)
        self._storage = StorageManager(self)
        self._persistence = PersistenceLayer(self)
        self._res_ent_map = defaultdict(str)  # type: Dict[str, str]
        self._root_manifest = None  # type: Optional[CdmManifestDefinition]
        self._known_artifact_attributes = None  # type: Optional[Dict[str, CdmTypeAttributeDefinition]]

    @property
    def storage(self) -> 'StorageManager':
        return self._storage

    @property
    def persistence(self) -> 'PersistenceLayer':
        return self._persistence

    def _add_document_objects(self, folder: 'CdmFolderDefinition', doc: 'CdmDocumentDefinition'):
        path = self.storage.create_absolute_corpus_path('{}{}'.format(doc._folder_path, doc.name), doc)
        self._document_library._add_document_path(path, folder, doc)

        return doc

    async def calculate_entity_graph_async(self, curr_manifest: 'CdmManifestDefinition', res_opt: Optional['ResolveOptions'] = None) -> None:
        """Calculate the entity to entity relationships for all the entities present in the folder and its sub folder."""
        with logger._enter_scope(self._TAG, self.ctx, self.calculate_entity_graph_async.__name__):
            for entity_dec in curr_manifest.entities:
                with logger._enter_scope(self._TAG, self.ctx, self.calculate_entity_graph_async.__name__ + 'perEntity'):
                    entity_path = await curr_manifest._get_entity_path_from_declaration(entity_dec, curr_manifest)
                    entity = await self.fetch_object_async(entity_path)  # type: Optional[CdmEntityDefinition]

                    if not isinstance(entity, CdmEntityDefinition):
                        logger.error(self.ctx, self._TAG, self.calculate_entity_graph_async.__name__, curr_manifest.at_corpus_path,
                                     CdmLogCode.ERR_INVALID_CAST, entity_path, 'CdmEntityDefinition')
                        continue
                    elif entity is None:
                        continue

                    res_entity = None  # type: Optional[CdmEntityDefinition]
                    # make options wrt this entity document and "relational" always
                    res_opt_copy = res_opt.copy() if res_opt is not None else ResolveOptions()
                    res_opt_copy.wrt_doc = entity.in_document
                    res_opt_copy.directives = AttributeResolutionDirectiveSet({'normalized', 'referenceOnly'})

                    is_resolved_entity = entity._is_resolved

                    # only create a resolved entity if the entity passed in was not a resolved entity
                    if not is_resolved_entity:
                        # first get the resolved entity so that all of the references are present
                        res_entity = await entity.create_resolved_entity_async('wrtSelf_' + entity.entity_name, res_opt_copy)
                    else:
                        res_entity = entity

                    # find outgoing entity relationships using attribute context
                    new_outgoing_relationships = self._find_outgoing_relationships(
                        res_opt_copy, res_entity, res_entity.attribute_context, is_resolved_entity)  # type: List[CdmE2ERelationship]

                    old_outgoing_relationships = self._outgoing_relationships.get(entity.at_corpus_path)  # type: List[CdmE2ERelationship]

                    # fix incoming rels based on any changes made to the outgoing rels
                    if old_outgoing_relationships is not None:
                        for rel in old_outgoing_relationships:
                            rel_string = rel.create_cache_key()
                            has_rel = any(x.create_cache_key() == rel_string for x in new_outgoing_relationships)

                            # remove any relationships that no longer exist
                            if not has_rel:
                                target_ent = await self.fetch_object_async(rel.to_entity, curr_manifest)  # type: CdmEntityDefinition
                                if not isinstance(target_ent, CdmEntityDefinition):
                                    logger.error(self.ctx, self._TAG, self.calculate_entity_graph_async.__name__, curr_manifest.at_corpus_path,
                                                 CdmLogCode.ERR_INVALID_CAST, rel.to_entity, 'CdmEntityDefinition')
                                    continue
                                if target_ent is not None:
                                    currIncoming = self._incoming_relationships.get(target_ent.at_corpus_path)  # type: List[CdmE2ERelationship]
                                    if currIncoming is not None:
                                        currIncoming.pop(currIncoming.index(rel))
                                    else:
                                        absolute_path = self.storage.create_absolute_corpus_path(rel.to_entity, rel.in_document)
                                        self._incoming_relationships.pop(absolute_path)

                    self._outgoing_relationships[entity.at_corpus_path] = new_outgoing_relationships

                    # flip outgoing entity relationships list to get incoming relationships map
                    if new_outgoing_relationships:
                        for rel in new_outgoing_relationships:
                            target_ent = await self.fetch_object_async(rel.to_entity, curr_manifest)
                            if not isinstance(target_ent, CdmEntityDefinition):
                                logger.error(self.ctx, self._TAG, self.calculate_entity_graph_async.__name__, curr_manifest.at_corpus_path,
                                             CdmLogCode.ERR_INVALID_CAST, rel.to_entity, 'CdmEntityDefinition')
                                continue
                            if target_ent is not None:
                                self._incoming_relationships[target_ent.at_corpus_path].append(rel)

                    # delete the resolved entity if we created one here
                    if not is_resolved_entity:
                        res_entity.in_document.owner.documents.remove(res_entity.in_document.name)

            for sub_manifest_def in curr_manifest.sub_manifests:
                sub_manifest = await self.fetch_object_async(sub_manifest_def.definition,
                                                             curr_manifest)  # type: Optional[CdmManifestDefinition]
                if not isinstance(sub_manifest, CdmManifestDefinition):
                    logger.error(self.ctx, self._TAG, self.calculate_entity_graph_async.__name__, curr_manifest.at_corpus_path,
                                 CdmLogCode.ERR_INVALID_CAST, sub_manifest_def.definition, 'CdmManifestDefinition')
                    continue
                await self.calculate_entity_graph_async(sub_manifest, res_opt)

    async def create_root_manifest_async(self, corpus_path: str) -> Optional['CdmManifestDefinition']:
        if self._is_path_manifest_document(corpus_path):
            new_manifest = await self.fetch_object_async(corpus_path)
            if not isinstance(new_manifest, CdmManifestDefinition):
                logger.error(self.ctx, self._TAG, self.create_root_manifest_async.__name__, corpus_path,
                             CdmLogCode.ERR_INVALID_CAST, corpus_path, 'CdmManifestDefinition')
                return None
            self._root_manifest = new_manifest
            return self._root_manifest
        return None

    def _get_attribute_name(self, named_reference):
        return named_reference[named_reference.rfind('/') + 1:]

    def _find_outgoing_relationships(self, res_opt: 'ResolveOptions', res_entity: 'CdmEntityDefinition',
                                     att_ctx: 'CdmAttributeContext',
                                     is_resolved_entity: Optional['bool'] = False,
                                     generated_att_set_context: Optional['CdmAttributeContext'] = None,
                                     was_projection_polymorphic: Optional[bool] = False,
                                     from_atts: List['CdmAttributeReference'] = None,
                                     entity_att_att_context: 'CdmAttributeContext' = None) -> List['CdmE2ERelationship']:
        out_rels = []  # type: List[CdmE2ERelationship]

        if att_ctx and att_ctx.contents:
            # as we traverse the context tree, look for these nodes which hold the foreign key
            # once we find a context node that refers to an entity reference, we will use the
            # nearest _generatedAttributeSet (which is above or at the same level as the entRef context)
            # and use its foreign key
            new_gen_set = att_ctx.contents.item('_generatedAttributeSet')  # type: CdmAttributeContext
            if new_gen_set is None:
                new_gen_set = generated_att_set_context

            is_entity_ref = False
            is_polymorphic_source = False
            for sub_att_ctx in att_ctx.contents:
                # find the top level entity definition's attribute context
                if entity_att_att_context is None and att_ctx.type == CdmAttributeContextType.ATTRIBUTE_DEFINITION \
                        and att_ctx.definition is not None \
                        and att_ctx.definition.fetch_object_definition(res_opt) is not None \
                        and att_ctx.definition.fetch_object_definition(res_opt).object_type == CdmObjectType.ENTITY_ATTRIBUTE_DEF:
                    entity_att_att_context = att_ctx

                # find entity references that identifies the 'this' entity
                if sub_att_ctx.object_type != CdmObjectType.ATTRIBUTE_CONTEXT_DEF:
                    continue

                child = sub_att_ctx  # type: CdmAttributeContext

                if child.definition and child.definition.object_type == CdmObjectType.ENTITY_REF:
                    to_entity = child.definition.fetch_object_definition(res_opt)

                    if to_entity and to_entity.object_type == CdmObjectType.PROJECTION_DEF:
                        # Projections

                        is_entity_ref = False

                        owner = to_entity.owner.owner if to_entity.owner else None

                        if owner:
                            is_polymorphic_source = (owner.object_type == CdmObjectType.ENTITY_ATTRIBUTE_DEF and
                                                     owner.is_polymorphic_source == True)
                        else:
                            logger.error(self.ctx, self._TAG, '_find_outgoing_relationships',
                                         CdmLogCode.ERR_OBJECT_WITHOUT_OWNER_FOUND)

                        # From the top of the projection (or the top most which contains a generatedSet / operations)
                        # get the attribute names for the foreign key
                        if new_gen_set and not from_atts:
                            from_atts = self._get_from_attributes(new_gen_set, from_atts)

                        # Fetch purpose traits
                        trait_refs_and_corpus_paths = None
                        entity_att = owner.fetch_object_definition(res_opt)  # type: 'CdmEntityAttributeDefinition'
                        if entity_att and entity_att.object_type == CdmObjectType.ENTITY_ATTRIBUTE_DEF and entity_att.purpose:
                            resolved_trait_set = entity_att.purpose._fetch_resolved_traits(res_opt)
                            if resolved_trait_set is not None:
                                trait_refs_and_corpus_paths = self._find_elevated_trait_refs_and_corpus_paths(res_opt, resolved_trait_set)  # type: List[Tuple['CdmTraitReference', str]]

                        out_rels = self._find_outgoing_relationships_for_projection(out_rels, child, res_opt,
                                                                                    res_entity, from_atts,
                                                                                    trait_refs_and_corpus_paths)

                        was_projection_polymorphic = is_polymorphic_source
                    else:
                        # Non-Projections based approach and current as-is code path

                        is_entity_ref = True

                        to_att = [self._get_attribute_name(trait.arguments[0].value.named_reference) for trait in
                                  child.exhibits_traits
                                  if trait.fetch_object_definition_name() == 'is.identifiedBy' and trait.arguments]  # type: List[str]

                        out_rels = self._find_outgoing_relationships_for_entity_ref(
                            to_entity,
                            to_att,
                            out_rels,
                            new_gen_set,
                            child,
                            res_opt,
                            res_entity,
                            is_resolved_entity,
                            was_projection_polymorphic,
                            is_entity_ref,
                            entity_att_att_context
                        )

                # repeat the process on the child node
                skip_add = was_projection_polymorphic and is_entity_ref

                sub_out_rels = self._find_outgoing_relationships(
                    res_opt,
                    res_entity,
                    child,
                    is_resolved_entity,
                    new_gen_set,
                    was_projection_polymorphic,
                    from_atts,
                    entity_att_att_context
                )
                out_rels.extend(sub_out_rels)

                # if it was a projection-based polymorphic source up through this branch of the tree and currently it has reached the end of the projection tree to come to a non-projection source,
                # then skip adding just this one source and continue with the rest of the tree
                if skip_add:
                    # skip adding only this entry in the tree and continue with the rest of the tree
                    was_projection_polymorphic = False

        return out_rels

    def _fetch_purpose_trait_refs_from_att_ctx(self, res_opt: 'ResolveOptions', attribute_ctx: 'CdmAttributeContext') -> List[Tuple['CdmTraitReference', str]]:
        if attribute_ctx.definition is not None:
            definition = attribute_ctx.definition.fetch_object_definition(res_opt)
            if definition and definition.object_type == CdmObjectType.ENTITY_ATTRIBUTE_DEF \
                    and cast('CdmEntityAttributeDefinition', definition) and cast('CdmEntityAttributeDefinition', definition).purpose is not None:
                resolved_trait_set = cast('CdmEntityAttributeDefinition', definition).purpose._fetch_resolved_traits(res_opt)  # type: 'ResolvedTraitSet'
                if resolved_trait_set is not None:
                    return self._find_elevated_trait_refs_and_corpus_paths(res_opt, resolved_trait_set)

        return None

    def _find_elevated_trait_refs_and_corpus_paths(self, res_opt: 'ResolveOptions', resolved_trait_set: 'ResolvedTraitSet') -> List[Tuple['CdmTraitReference', str]]:
        trait_refs_and_corpus_paths = []
        for resolvedTrait in resolved_trait_set.rt_set:
            trait_ref = CdmObject._resolved_trait_to_trait_ref(res_opt, resolvedTrait)
            if trait_ref is not None and resolvedTrait.trait.in_document is not None and not StringUtils.is_null_or_white_space(resolvedTrait.trait.in_document.at_corpus_path):
                trait_refs_and_corpus_paths.append([trait_ref, resolvedTrait.trait.in_document.at_corpus_path])

        return trait_refs_and_corpus_paths

    def _find_outgoing_relationships_for_projection(
        self,
        out_rels: List['CdmE2ERelationship'],
        child: 'CdmAttributeContext',
        res_opt: 'ResolveOptions',
        res_entity: 'CdmEntityDefinition',
        from_atts: Optional[List['CdmAttributeReference']] = None,
        trait_refs_and_corpus_paths: Optional[List[Tuple['CdmTraitReference', str]]] = None
    ) -> List['CdmE2ERelationship']:
        """
        Find the outgoing relationships for Projections.
        Given a list of 'From' attributes, find the E2E relationships based on the 'To' information stored in the trait of the attribute in the resolved entity
        """
        if from_atts:
            res_opt_copy = res_opt.copy()
            res_opt_copy.wrt_doc = res_entity.in_document

            # Extract the from entity from res_entity
            ref_to_logical_entity = res_entity.attribute_context.definition
            unresolved_entity = ref_to_logical_entity.fetch_object_definition(
                res_opt_copy) if ref_to_logical_entity else None
            from_entity = unresolved_entity.ctx.corpus.storage.create_relative_corpus_path(
                unresolved_entity.at_corpus_path, unresolved_entity.in_document) if unresolved_entity else None

            for i in range(len(from_atts)):
                # List of to attributes from the constant entity argument parameter
                from_attr_def = from_atts[i].fetch_object_definition(res_opt_copy)
                tuple_list = self._get_to_attributes(from_attr_def, res_opt_copy)

                # For each of the to attributes, create a relationship
                for tuple in tuple_list:
                    new_e2e_rel = CdmE2ERelationship(self.ctx, tuple[2])
                    new_e2e_rel.from_entity = self.storage.create_absolute_corpus_path(from_entity, unresolved_entity)
                    new_e2e_rel.from_entity_attribute = from_atts[i].fetch_object_definition_name()
                    new_e2e_rel.to_entity = self.storage.create_absolute_corpus_path(tuple[0], res_entity)
                    new_e2e_rel.to_entity_attribute = tuple[1]

                    self._add_trait_refs_and_corpus_paths_to_relationship(trait_refs_and_corpus_paths, new_e2e_rel)

                    out_rels.append(new_e2e_rel)

        return out_rels

    # / Find the outgoing relationships for Non-Projections EntityRef
    def _find_outgoing_relationships_for_entity_ref(
        self,
        to_entity: 'CdmObjectDefinition',
        to_att: List[str],
        out_rels: List['CdmE2ERelationship'],
        new_gen_set: 'CdmAttributeContext',
        child: 'CdmAttributeContext',
        res_opt: 'ResolveOptions',
        res_entity: 'CdmEntityDefinition',
        is_resolved_entity: bool,
        was_projection_polymorphic: Optional[bool] = False,
        was_entity_ref: Optional[bool] = False,
        attribute_ctx: 'CdmAttributeContext' = None
    ) -> List['CdmE2ERelationship']:
        def find_added_attribute_identity(context: 'CdmAttributeContext') -> Optional[str]:
            """get the attribute name from the foreign key"""
            if context is not None and context.contents is not None:
                for sub in context.contents:
                    if sub.object_type != CdmObjectType.ATTRIBUTE_CONTEXT_DEF or sub.type == CdmAttributeContextType.ENTITY:
                        continue
                    sub_ctx = sub  # type: CdmAttributeContext
                    fk = find_added_attribute_identity(sub_ctx)
                    if fk is not None:
                        return fk
                    elif sub_ctx.type == CdmAttributeContextType.ADDED_ATTRIBUTE_IDENTITY and sub_ctx.contents:
                        # the foreign key is found in the first of the array of the 'ADDED_ATTRIBUTE_IDENTITY' context type
                        return cast('CdmObjectReference', sub_ctx.contents[0]).named_reference
            return None

        # entity references should have the 'is.identifiedBy' trait, and the entity ref should be valid
        if len(to_att) == 1 and to_entity:
            foreign_key = find_added_attribute_identity(new_gen_set)

            if foreign_key is not None:
                # this list will contain the final tuples used for the toEntity where
                # index 0 is the absolute path to the entity and index 1 is the toEntityAttribute
                to_att_list = []

                # get the list of toAttributes from the traits on the resolved attribute
                resolved_res_opt = ResolveOptions(res_entity.in_document)
                att_from_fk = self._resolve_symbol_reference(resolved_res_opt, res_entity.in_document, foreign_key,
                                                             CdmObjectType.TYPE_ATTRIBUTE_DEF,
                                                             False)  # type: CdmTypeAttributeDefinition
                if att_from_fk is not None:
                    fk_arg_values = self._get_to_attributes(att_from_fk, resolved_res_opt)

                    for const_ent in fk_arg_values:
                        absolute_path = self.storage.create_absolute_corpus_path(const_ent[0], att_from_fk)
                        to_att_list.append((absolute_path, const_ent[1]))

                trait_refs_and_corpus_paths = self._fetch_purpose_trait_refs_from_att_ctx(res_opt, attribute_ctx)

                for attribute_tuple in to_att_list:
                    from_att = self._get_attribute_name(foreign_key).replace(child.name + '_', '')
                    new_e2e_relationship = CdmE2ERelationship(self.ctx, '')
                    new_e2e_relationship.from_entity_attribute = from_att
                    new_e2e_relationship.to_entity_attribute = attribute_tuple[1]

                    self._add_trait_refs_and_corpus_paths_to_relationship(trait_refs_and_corpus_paths, new_e2e_relationship)

                    if is_resolved_entity:
                        new_e2e_relationship.from_entity = res_entity.at_corpus_path
                        if attribute_tuple[0] in self._res_ent_map:
                            new_e2e_relationship.to_entity = self._res_ent_map[attribute_tuple[0]]
                        else:
                            new_e2e_relationship.to_entity = attribute_tuple[0]
                    else:
                        # find the path of the unresolved entity using the attribute context of the resolved entity
                        ref_to_logical_entity = res_entity.attribute_context.definition

                        if ref_to_logical_entity is not None:
                            un_resolved_entity = ref_to_logical_entity.fetch_object_definition(res_opt)

                        selected_entity = un_resolved_entity if un_resolved_entity is not None else res_entity
                        selected_ent_corpus_path = un_resolved_entity.at_corpus_path if un_resolved_entity is not None else res_entity.at_corpus_path.replace(
                            'wrtSelf_', '')

                        new_e2e_relationship.from_entity = self.storage.create_absolute_corpus_path(
                            selected_ent_corpus_path, selected_entity)
                        new_e2e_relationship.to_entity = attribute_tuple[0]

                    # if it was a projection-based polymorphic source up through this branch of the tree and currently it has reached the end of the projection tree to come to a non-projection source,
                    # then skip adding just this one source and continue with the rest of the tree
                    if not (was_projection_polymorphic and was_entity_ref):
                        out_rels.append(new_e2e_relationship)

        return out_rels

    def _add_trait_refs_and_corpus_paths_to_relationship(self, trait_refs_and_corpus_paths: List[Tuple['CdmTraitReference', str]], cdm_e2e_rel: 'CdmE2ERelationship') -> None:
        if trait_refs_and_corpus_paths is not None:
            for item1, item2 in trait_refs_and_corpus_paths:
                cdm_e2e_rel.exhibits_traits.append(item1)
                cdm_e2e_rel._get_elevated_trait_corpus_paths()[item1] = item2

    def _create_definition_cache_tag(self, res_opt: 'ResolveOptions', definition: 'CdmObject', kind: str,
                                     extra_tags: str = '',
                                     not_known_to_have_parameters: bool = False, path_to_def: str = None) -> str:
        # construct a tag that is unique for a given object in a given context
        # context is:
        #   (1) the wrt_doc has a set of imports and defintions that may change what the object is point at
        #   (2) there are different kinds of things stored per object (resolved traits, atts, etc.)
        #   (3) the directives from the resolve Options might matter
        #   (4) sometimes the caller needs different caches (extra_tags) even give 1-3 are the same
        # the hardest part is (1). To do this, see if the object has a set of reference documents registered.
        # if there is nothing registered, there is only one possible way to resolve the object so don't include doc info in the tag.
        # if there IS something registered, then the object could be ambiguous.
        # find the 'index' of each of the ref documents (potential definition of something referenced under this scope)
        # in the wrt document's list of imports. sort the ref docs by their index,
        # the relative ordering of found documents makes a unique context.
        # the hope is that many, many different lists of imported files will result in identical reference sortings, so lots of re-use
        # since this is an expensive operation, actually cache the sorted list associated with this object and wrt_doc

        # easy stuff first
        this_id = ''
        this_path = definition._declared_path.replace('/',
                                                      '') if definition.object_type == CdmObjectType.PROJECTION_DEF else definition.at_corpus_path
        if path_to_def and not_known_to_have_parameters:
            this_id = path_to_def
        else:
            this_id = str(definition.id)

        tag_suffix = '-{}-{}'.format(kind, this_id)
        # Some object types like traits don't change their resolved from depending on the directives.
        # This optimization is only useful when the same corpus is used to resolve objects using different directives.
        SIMPLE_CACHE_TAG_TYPES = {CdmObjectType.DATA_TYPE_DEF, CdmObjectType.PURPOSE_DEF, CdmObjectType.TRAIT_DEF, CdmObjectType.TRAIT_GROUP_DEF}
        simple_cache_tag = definition.object_type in SIMPLE_CACHE_TAG_TYPES

        if not simple_cache_tag:
            tag_suffix += '-({})'.format(res_opt.directives.get_tag() if res_opt.directives else '')

        # only for attributes
        if kind == 'rasb':
            # if MaxDepth was not initialized before, initialize it now
            if res_opt._depth_info.max_depth is None:
                res_opt._depth_info.max_depth = res_opt.max_depth

            # add to the cache tag either if we reached maximum depth or how many levels we can go down until reaching the maximum depth
            if res_opt._depth_info.current_depth > res_opt._depth_info.max_depth:
                tag_suffix += '-overMaxDepth'
            else:
                curr_depth_info = res_opt._depth_info
                tag_suffix += '-{}toMaxDepth'.format(curr_depth_info.max_depth - curr_depth_info.current_depth)
        if res_opt._in_circular_reference:
            tag_suffix += '-pk'
        if extra_tags:
            tag_suffix += '-{}'.format(extra_tags)

        # is there a registered set?
        # (for the objectdef, not for a reference) of the many symbols involved in defining this thing(might be none)
        obj_def = definition.fetch_object_definition(res_opt)
        symbols_ref = None  # type: SymbolSet
        if obj_def:
            key = CdmCorpusDefinition._fetch_cache_key_from_object(obj_def, kind)
            symbols_ref = self._definition_reference_symbols.get(key)

        if symbols_ref is None and this_path is not None:
            # every symbol should depend on at least itself
            sym_set_this = SymbolSet()
            sym_set_this._add(this_path)
            self._register_definition_reference_symbols(definition, kind, sym_set_this)
            symbols_ref = sym_set_this

        if symbols_ref and symbols_ref._size > 0:
            # each symbol may have definitions in many documents. use import_priority to figure out which one we want
            wrt_doc = res_opt.wrt_doc
            found_doc_ids = set()
            if wrt_doc._import_priorities:
                for sym_ref in symbols_ref:
                    # get the set of docs where defined
                    docs_res = self._docs_for_symbol(res_opt, wrt_doc, definition.in_document, sym_ref)
                    # we only add the best doc if there are multiple options
                    if docs_res is not None and docs_res.doc_list is not None and len(docs_res.doc_list) > 1:
                        doc_best = CdmCorpusDefinition._fetch_priority_doc(docs_res.doc_list,
                                                                           wrt_doc._import_priorities.import_priority)
                        if doc_best:
                            found_doc_ids.add(str(doc_best.id))

            found_doc_ids_list = list(found_doc_ids)
            found_doc_ids_list.sort()
            tag_pre = '-'.join(found_doc_ids_list)

            return tag_pre + tag_suffix

        return None

    def _index_documents(self, res_opt: 'ResolveOptions', load_imports: bool, root_doc: 'CdmDocumentDefinition', docs_loaded: Set[str]) -> bool:
        docs_not_indexed = self._document_library._list_docs_not_indexed(root_doc, docs_loaded)  # type: Set[CdmDocumentDefinition]

        # Step: clear document caches.
        for doc in docs_not_indexed:
            if not doc._declarations_indexed or load_imports:
                logger.debug(self.ctx, self._TAG, self._index_documents.__name__, doc.at_corpus_path,
                             'index start: {}'.format(doc.at_corpus_path))
                doc._clear_caches()

        # Step: check basic integrity.
        for doc in docs_not_indexed:
            if not doc._declarations_indexed or load_imports:
                doc._check_integrity()

        # Step: declare definitions of objects in this doc.
        for doc in docs_not_indexed:
            if (not doc._declarations_indexed or load_imports) and doc._is_valid:
                doc._declare_object_definitions()

        if load_imports:
            # Step: index import priorities.
            for doc in docs_not_indexed:
                if doc._is_valid:
                    # index any imports.
                    doc._get_import_priorities()

            # Step: make sure we can find everything that is named by reference.
            for doc in docs_not_indexed:
                if doc._is_valid:
                    res_opt_local = res_opt.copy()
                    res_opt_local.wrt_doc = doc
                    doc._resolve_object_definitions(res_opt_local)

           # Step: now resolve any trait arguments that are type object.
            for doc in docs_not_indexed:
                res_opt_local = res_opt.copy()
                res_opt_local.wrt_doc = doc
                doc._resolve_trait_arguments(res_opt_local)

        # Step: finish up
        for doc in docs_not_indexed:
            doc._finish_indexing(load_imports)

        return True

    def _docs_for_symbol(self, res_opt: 'ResolveOptions', wrt_doc: 'CdmDocumentDefinition',
                         from_doc: 'CdmDocumentDefinition', symbol_def: str) -> DocsResult:
        ctx = self.ctx
        result = DocsResult(new_symbol=symbol_def)

        # first decision, is the symbol defined anywhere?
        result.doc_list = self._symbol_definitions.get(symbol_def)
        if not result.doc_list:
            # this can happen when the symbol is disambiguated with a moniker for one of the imports used
            # in this situation, the 'wrt' needs to be ignored,
            # the document where the reference is being made has a map of the 'one best' monikered import to search for each moniker
            pre_end = symbol_def.find('/')

            if pre_end == 0:
                # absolute refererence
                logger.error(self.ctx, self._TAG, '_docs_for_symbol', wrt_doc.at_corpus_path,
                             'no support for absolute references yet. fix \'{}\''.format(symbol_def),
                             ctx._relative_path)

                return None

            if pre_end > 0:
                prefix = symbol_def[0: pre_end]
                result.new_symbol = symbol_def[pre_end + 1:]
                result.doc_list = self._symbol_definitions.get(result.new_symbol)

                temp_moniker_doc = None
                using_wrt_doc = False
                if from_doc and from_doc._import_priorities and prefix in from_doc._import_priorities.moniker_priority_map:
                    temp_moniker_doc = from_doc._import_priorities.moniker_priority_map.get(prefix)
                elif wrt_doc and wrt_doc._import_priorities and prefix in wrt_doc._import_priorities.moniker_priority_map:
                    # if that didn't work, then see if the wrt_doc can find the moniker
                    temp_moniker_doc = wrt_doc._import_priorities.moniker_priority_map.get(prefix)
                    using_wrt_doc = True

                if temp_moniker_doc is not None:
                    # if more monikers, keep looking
                    if result.new_symbol.find('/') >= 0 and (
                            using_wrt_doc or result.new_symbol not in self._symbol_definitions):
                        curr_docs_result = self._docs_for_symbol(res_opt, wrt_doc, temp_moniker_doc, result.new_symbol)
                        if curr_docs_result.doc_list is None and from_doc is wrt_doc:
                            # we are back at the top and we have not found the docs, move the wrtDoc down one level
                            return self._docs_for_symbol(res_opt, temp_moniker_doc, temp_moniker_doc, result.new_symbol)
                        else:
                            return curr_docs_result
                    result.doc_best = temp_moniker_doc
                else:
                    # moniker not recognized in either doc, fail with grace
                    result.new_symbol = symbol_def
                    result.doc_list = None

        return result

    def _fetch_empty_resolved_trait_set(self, res_opt: 'ResolveOptions') -> 'ResolvedTraitSet':
        from cdm.resolvedmodel import ResolvedTraitSet

        key = ''
        if res_opt:
            if res_opt.wrt_doc:
                key = str(res_opt.wrt_doc.id)
            key += '-'
            if res_opt.directives:
                key += res_opt.directives.get_tag()
        rts = self._empty_rts.get(key)
        if not rts:
            rts = ResolvedTraitSet(res_opt)
            self._empty_rts[key] = rts

        return rts

    def _finish_resolve(self) -> None:
        #  cleanup references
        logger.debug(self.ctx, self._TAG, self._finish_resolve.__name__, None, 'finishing...')

        # turn elevated traits back on, they are off by default and should work fully now that everything is resolved
        all_documents = self._document_library._list_all_documents()
        for doc in all_documents:
            doc._finish_indexing(False)

    async def _load_imports_async(self, doc: 'CdmDocumentDefinition', docs_loading: Set[str], res_opt: 'ResolveOptions') -> None:
        """Recursively load all imports of a given document."""
        if not doc:
            # if there's not document, our job here is done.
            return

        async def _load_docs(doc_path: str) -> None:
            """Loads a document and its imports recursively."""
            if not self._document_library._need_to_load_document(doc_path, docs_loading):
                return
            # load it
            loaded_doc = await self._document_library._load_folder_or_document(doc_path, False, res_opt)  # type: CdmDocumentDefinition

            if loaded_doc:
                logger.debug(self.ctx, self._TAG, self._load_imports_async.__name__, loaded_doc.at_corpus_path,
                            'resolved import for \'{}\''.format(loaded_doc.name))
            else:
                logger.warning(self.ctx, self._TAG, CdmCorpusDefinition._load_imports_async.__name__,
                               None, CdmLogCode.WARN_RESOLVE_IMPORT_FAILED, doc_path, doc_path)

            await self._load_imports_async(loaded_doc, docs_loading, res_opt)

        # Loop through all of the document's imports and load them recursively.
        task_list = []
        for imp in doc.imports:
            if not imp._document:
                path = self.storage.create_absolute_corpus_path(imp.corpus_path, doc)
                load_task = _load_docs(path)
                task_list.append(load_task)

        # wait for all of the missing docs to finish loading
        await asyncio.gather(*task_list)

    def make_object(self, of_type: 'CdmObjectType', name_or_ref: str = None,
                    simple_name_ref: bool = False) -> 'TObject':
        """instantiates a OM class based on the object type passed as first parameter."""
        from .cdm_make_object import make_object

        return make_object(self.ctx, of_type, name_or_ref, simple_name_ref)

    def make_ref(self, of_type: 'CdmObjectType', ref_obj: Union[str, 'CdmObjectDefinition'],
                 simple_name_ref: bool) -> 'TObjectRef':
        """instantiates a OM class reference based on the object type passed as first parameter."""
        object_ref = None

        if not ref_obj:
            return None

        if isinstance(ref_obj, str):
            object_ref = self.make_object(of_type, ref_obj, simple_name_ref)
        else:
            if ref_obj.object_type == of_type:
                object_ref = ref_obj
            else:
                object_ref = self.make_object(of_type)
                object_ref.explicit_reference = ref_obj

        return object_ref

    def _register_definition_reference_symbols(self, definition: 'CdmObject', kind: str,
                                               symbol_ref_set: 'SymbolSet') -> None:
        key = CdmCorpusDefinition._fetch_cache_key_from_object(definition, kind)
        existing_symbols = self._definition_reference_symbols.get(key, None)
        if existing_symbols is None:
            # nothing set, just use it
            self._definition_reference_symbols[key] = symbol_ref_set
        else:
            # something there, need to merge
            existing_symbols._merge(symbol_ref_set)

    def _register_symbol(self, symbol_def: str, in_doc: 'CdmDocumentDefinition') -> None:
        if symbol_def not in self._symbol_definitions:
            self._symbol_definitions[symbol_def] = []

        self._symbol_definitions[symbol_def].append(in_doc)

    def _remove_document_objects(self, folder: 'CdmFolderDefinition', doc: 'CdmDocumentDefinition') -> None:
        # the field defintion_wrt_tag has been removed
        # Don't worry about defintion_wrt_tag because it uses the doc ID that won't get re-used in this session unless
        # there are more than 4 billion objects every symbol defined in this document is pointing at the document, so
        # remove from cache. Also remove the list of docs that it depends on.
        self._remove_object_definitions(doc)

        # Remove from path lookup, folder lookup and global list of documents.
        path = self.storage.create_absolute_corpus_path(doc._folder_path + doc.name, doc)
        self._document_library._remove_document_path(path, folder, doc)

    def _remove_object_definitions(self, doc: CdmDocumentDefinition) -> None:
        def visit_callback(i_object: 'CdmObject', path: str) -> bool:
            if '(unspecified)' in path:
                return True

            if i_object.object_type in [CdmObjectType.ENTITY_DEF, CdmObjectType.PARAMETER_DEF,
                                        CdmObjectType.TRAIT_DEF, CdmObjectType.TRAIT_GROUP_DEF,
                                        CdmObjectType.PURPOSE_DEF,
                                        CdmObjectType.DATA_TYPE_DEF, CdmObjectType.TYPE_ATTRIBUTE_DEF,
                                        CdmObjectType.ENTITY_ATTRIBUTE_DEF, CdmObjectType.ATTRIBUTE_GROUP_DEF,
                                        CdmObjectType.CONSTANT_ENTITY_DEF, CdmObjectType.ATTRIBUTE_CONTEXT_DEF,
                                        CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF,
                                        CdmObjectType.REFERENCED_ENTITY_DECLARATION_DEF, CdmObjectType.PROJECTION_DEF,
                                        CdmObjectType.OPERATION_ADD_COUNT_ATTRIBUTE_DEF,
                                        CdmObjectType.OPERATION_ADD_SUPPORTING_ATTRIBUTE_DEF,
                                        CdmObjectType.OPERATION_ADD_TYPE_ATTRIBUTE_DEF,
                                        CdmObjectType.OPERATION_EXCLUDE_ATTRIBUTES_DEF,
                                        CdmObjectType.OPERATION_ARRAY_EXPANSION_DEF,
                                        CdmObjectType.OPERATION_COMBINE_ATTRIBUTES_DEF,
                                        CdmObjectType.OPERATION_RENAME_ATTRIBUTES_DEF,
                                        CdmObjectType.OPERATION_REPLACE_AS_FOREIGN_KEY_DEF,
                                        CdmObjectType.OPERATION_INCLUDE_ATTRIBUTES_DEF,
                                        CdmObjectType.OPERATION_ADD_ATTRIBUTE_GROUP_DEF,
                                        CdmObjectType.OPERATION_ALTER_TRAITS_DEF,
                                        CdmObjectType.OPERATION_ADD_ARTIFACT_ATTRIBUTE_DEF]:
                self._unregister_symbol(path, doc)
                self._unregister_definition_reference_documents(i_object, 'rasb')

            return False

        doc.visit('', visit_callback, None)

    async def _resolve_imports_async(self, doc: 'CdmDocumentDefinition', docs_loading: Set[str], res_opt: 'ResolveOptions') -> None:
        """takes a callback that askes for promise to do URI resolution."""
        # load imports (and imports of imports)
        await self._load_imports_async(doc, docs_loading, res_opt)
        # now that everything is loaded, attach import docs to this doc's import list
        self._set_import_documents(doc)

    async def resolve_references_and_validate_async(self, stage: 'CdmValidationStep',
                                                    stage_through: 'CdmValidationStep',
                                                    res_opt: Optional['ResolveOptions'] = None) -> 'CdmValidationStep':
        warnings.warn('This function is likely to be removed soon.', DeprecationWarning)

        # use the provided directives or use the current default
        directives = None  # type: AttributeResolutionDirectiveSet
        if res_opt is not None:
            directives = res_opt.directives
        else:
            directives = self.default_resolution_directives
        res_opt = ResolveOptions(wrt_doc=None, directives=directives)
        res_opt._depth_info._reset()

        for doc in self._document_library._list_all_documents():
            await doc[1]._index_if_needed(res_opt)

        finish_resolve = stage_through == stage

        def traits_step():
            self._resolve_references_step('resolving traits...', self._resolve_traits, res_opt, False, finish_resolve,
                                          CdmValidationStep.TRAITS)
            return self._resolve_references_step('checking required arguments...',
                                                 self._resolve_references_traits_arguments,
                                                 res_opt, True, finish_resolve, CdmValidationStep.ATTRIBUTES)

        switcher = {
            CdmValidationStep.START: lambda: self._resolve_references_step('defining traits...', lambda *args: None,
                                                                           res_opt, True,
                                                                           finish_resolve or stage_through == CdmValidationStep.MINIMUM_FOR_RESOLVING,
                                                                           CdmValidationStep.TRAITS),
            CdmValidationStep.TRAITS: traits_step,
            CdmValidationStep.ATTRIBUTES: lambda: self._resolve_references_step('resolving attributes...',
                                                                                self._resolve_attributes, res_opt, True,
                                                                                finish_resolve,
                                                                                CdmValidationStep.ENTITY_REFERENCES),
            CdmValidationStep.ENTITY_REFERENCES: lambda: self._resolve_references_step(
                'resolving foreign key references...',
                self._resolve_foreign_key_references, res_opt, True, True, CdmValidationStep.FINISHED)
        }

        switcher[CdmValidationStep.TRAIT_APPLIERS] = switcher[CdmValidationStep.START]

        func = switcher.get(stage, lambda: CdmValidationStep.ERROR)

        # bad step sent in
        return func()

    def _resolve_references_step(self, status_message: str, resolve_action: Callable, resolve_opt: 'ResolveOptions',
                                 stage_finished: bool, finish_resolve: bool,
                                 next_stage: 'CdmValidationStep') -> 'CdmValidationStep':
        logger.debug(self.ctx, self._TAG, self._resolve_references_step.__name__, None, status_message)
        entity_nesting = [0]

        for doc in self._document_library._list_all_documents():
            # cache import documents
            current_doc = doc  # type: CdmDocumentDefinition
            resolve_opt.wrt_doc = current_doc
            resolve_action(current_doc, resolve_opt, entity_nesting)

        if stage_finished:
            if finish_resolve:
                self._finish_resolve()
                return CdmValidationStep.FINISHED
            return next_stage
        return next_stage

    def _resolve_foreign_key_references(self, current_doc: 'CdmDocumentDefinition', res_opt: 'ResolveOptions',
                                        entity_nesting: List[int]) -> None:
        ctx = self.ctx
        nesting = entity_nesting[0]

        def pre_visit(obj: 'CdmObject', path: str) -> bool:
            nonlocal ctx, nesting
            ot = obj.object_type
            if ot == CdmObjectType.ATTRIBUTE_GROUP_DEF:
                nesting += 1
            if ot == CdmObjectType.ENTITY_DEF:
                nesting += 1
                if nesting == 1:
                    ctx._relative_path = path
                    obj.fetch_resolved_entity_references(res_opt)
            return False

        def post_visit(obj: 'CdmObject', path: str) -> bool:
            nonlocal nesting
            if obj.object_type == CdmObjectType.ENTITY_DEF or obj.object_type == CdmObjectType.ATTRIBUTE_GROUP_DEF:
                nesting -= 1
            return False

        current_doc.visit('', pre_visit, post_visit)
        entity_nesting[0] = nesting

    def _resolve_attributes(self, current_doc: 'CdmDocumentDefinition', res_opt: 'ResolveOptions',
                            entity_nesting: List[int]) -> None:
        ctx = self.ctx
        nesting = entity_nesting[0]

        def pre_visit(obj: 'CdmObject', path: str) -> bool:
            nonlocal ctx, nesting

            ot = obj.object_type
            if ot == CdmObjectType.ENTITY_DEF:
                nesting += 1
                if nesting == 1:
                    ctx._relative_path = path
                    obj.fetch_resolved_attributes(res_opt)

            if ot == CdmObjectType.ATTRIBUTE_GROUP_DEF:
                nesting += 1
                if nesting == 1:
                    ctx._relative_path = path
                    obj.fetch_resolved_attributes(res_opt)
            return False

        def post_visit(obj: 'CdmObject', path: str) -> bool:
            nonlocal nesting

            if obj.object_type == CdmObjectType.ENTITY_DEF or obj.object_type == CdmObjectType.ATTRIBUTE_GROUP_DEF:
                nesting -= 1
            return False

        current_doc.visit('', pre_visit, post_visit)
        entity_nesting[0] = nesting

    def _resolve_references_traits_arguments(self, current_doc: 'CdmDocumentDefinition', res_opt: 'ResolveOptions',
                                             entity_nesting: List[int]) -> None:
        ctx = self.ctx

        def check_required_params_on_resolved_traits(obj) -> 'CdmObject':
            rts = obj._fetch_resolved_traits(res_opt)
            if rts is None:
                return

            for rt in rts:
                found = 0
                resolved = 0
                if rt and rt.parameter_values:
                    for i_param in range(len(rt.parameter_values)):
                        param = rt.parameter_values.fetch_parameter_at_index(i_param)
                        if param.required:
                            found += 1
                            if rt.parameter_values.fetch_value(i_param) is None:
                                defi = obj.fetch_object_definition(res_opt)
                                logger.error(self.ctx, self._TAG, self._resolve_references_traits_arguments.__name__, current_doc.at_corpus_path,
                                             CdmLogCode.ERR_TRAIT_ARGUMENT_MISSING, param.name, rt.trait_name,
                                             defi.get_name())
                            else:
                                resolved += 1
                if found > 0 and found == resolved:
                    defi = obj.fetch_object_definition(res_opt)
                    logger.debug(self.ctx, self._TAG, self._resolve_references_traits_arguments.__name__,
                                current_doc.at_corpus_path,
                                'found and resolved \'{}\' required parameters of trait \'{}\' on \'{}\''.
                                format(found, rt.trait_name, defi.get_name()))

        def post_visit(obj: 'CdmObject', path: str) -> bool:
            ot = obj.object_type
            if ot == CdmObjectType.ENTITY_DEF:
                ctx._relative_path = path
                # get the resolution of all parameters and values through inheritence and defaults and arguments, etc.
                check_required_params_on_resolved_traits(obj)
                has_attribute_defs = obj.Attributes
                # do the same for all attributes
                if has_attribute_defs is not None:
                    for att_def in has_attribute_defs:
                        check_required_params_on_resolved_traits(att_def)
            if ot == CdmObjectType.ATTRIBUTE_GROUP_DEF:
                ctx._relative_path = path
                # get the resolution of all parameters and values through inheritence and defaults and arguments, etc.
                check_required_params_on_resolved_traits(obj)
                member_attribute_defs = obj.members
                # do the same for all attributes
                if member_attribute_defs is not None:
                    for att_def in member_attribute_defs:
                        check_required_params_on_resolved_traits(att_def)
            return False

        current_doc.visit("", None, post_visit)

    def _resolve_traits(self, current_doc: 'CdmDocumentDefinition', res_opt: 'ResolveOptions',
                        entity_nesting: List[int]) -> None:
        ctx = self.ctx
        nesting = entity_nesting[0]

        def pre_visit(obj: 'CdmObject', path: str) -> bool:
            nonlocal ctx, nesting
            if obj.object_type == CdmObjectType.TRAIT_DEF or obj.object_type == CdmObjectType.TRAIT_GROUP_DEF or \
                    obj.object_type == CdmObjectType.PURPOSE_DEF or obj.object_type == CdmObjectType.DATA_TYPE_DEF or \
                    obj.object_type == CdmObjectType.ENTITY_DEF or obj.object_type == CdmObjectType.ATTRIBUTE_GROUP_DEF:
                if obj.object_type == CdmObjectType.ENTITY_DEF or obj.object_type == CdmObjectType.ATTRIBUTE_GROUP_DEF:
                    nesting += 1
                    # don't do this for entities and groups defined within entities since getting traits already does that
                    if nesting > 1:
                        return False

                    ctx._relative_path = path
                    obj.fetch_resolved_traits(res_opt)
            elif obj.object_type == CdmObjectType.ENTITY_ATTRIBUTE_DEF or obj.object_type == CdmObjectType.TYPE_ATTRIBUTE_DEF:
                ctx._relative_path = path
                obj.fetch_resolved_traits(res_opt)

            return False

        def post_visit(obj: 'CdmObject', path: str) -> bool:
            nonlocal nesting
            if obj.object_type == CdmObjectType.ENTITY_DEF or obj.object_type == CdmObjectType.ATTRIBUTE_GROUP_DEF:
                nesting -= 1
            return False

        current_doc.visit('', pre_visit, post_visit)

        entity_nesting[0] = nesting

    def _resolve_symbol_reference(self, res_opt: 'ResolveOptions', from_doc: 'CdmDocumentDefinition', symbol_def: str,
                                  expected_type: 'CdmObjectType', retry: bool) -> 'CdmObject':
        """given a symbolic name,
        find the 'highest priority' definition of the object from the point of view of a given document (with respect to, wrt_doc)
        (meaning given a document and the things it defines and the files it imports and the files they import,
        where is the 'last' definition found)"""

        if not res_opt or not res_opt.wrt_doc or not symbol_def:
            # no way to figure this out
            return None

        wrt_doc = res_opt.wrt_doc

        if wrt_doc._needs_indexing and not wrt_doc._currently_indexing:
            loop = asyncio.get_event_loop()
            nest_asyncio.apply(loop)
            if not loop.run_until_complete(wrt_doc._index_if_needed(res_opt, True)):
                logger.error(self.ctx, self._TAG, '_resolve_symbol_reference', wrt_doc.at_corpus_path, CdmLogCode.ERR_INDEX_FAILED)
                return None

        if wrt_doc._needs_indexing and res_opt.imports_load_strategy == ImportsLoadStrategy.DO_NOT_LOAD:
            logger.error(self.ctx, self._TAG, '_resolve_symbol_reference', wrt_doc.at_corpus_path, CdmLogCode.ERR_SYMBOL_NOT_FOUND, symbol_def,
                         'because the ImportsLoadStrategy is set to DO_NOT_LOAD')
            return None

        # save the symbol name as it got here
        initial_symbol = symbol_def

        # when trying to find a reference, first find the definition that contains it
        # and then look for the reference inside it.
        is_reference = symbol_def.endswith('(ref)')
        if is_reference:
            def_index = symbol_def.find('/')
            symbol_def = symbol_def[0: def_index]

        # get the array of documents where the symbol is defined
        symbol_docs_result = self._docs_for_symbol(res_opt, wrt_doc, from_doc, symbol_def)
        doc_best = symbol_docs_result.doc_best
        symbol_def = symbol_docs_result.new_symbol

        if not is_reference:
            initial_symbol = symbol_def

        docs = symbol_docs_result.doc_list  # type: List[CdmDocumentDefinition]

        if docs:
            # add this symbol to the set being collected in res_opt, we will need this when caching
            if not res_opt._symbol_ref_set:
                res_opt._symbol_ref_set = SymbolSet()

            res_opt._symbol_ref_set._add(symbol_def)
            # for the given doc, there is a sorted list of imported docs (including the doc itself as item 0).
            # find the lowest number imported document that has a definition for this symbol
            if not wrt_doc._import_priorities:
                return None  # need to index imports first, should have happened

            import_priority = wrt_doc._import_priorities.import_priority  # type: Dict[CdmDocumentDefinition, ImportInfo]
            if not import_priority:
                return None

            if not doc_best:
                doc_best = CdmCorpusDefinition._fetch_priority_doc(docs, import_priority)

        # perhaps we have never heard of this symbol in the imports for this document?
        if not doc_best:
            return None

        # return the definition found in the best document
        found = doc_best.internal_declarations.get(symbol_def)

        # in case we are trying to find a reference, the object we found previously is the definition that contains the reference.
        # look inside the definition now.
        if found and is_reference:
            found_ref = None  # type: Optional[CdmObjectBase]
            # try to find the reference

            def find_ref_callback(obj: CdmObject, obj_path: str):
                nonlocal found_ref
                if initial_symbol == obj_path:
                    found_ref = obj
                    return True
                return False
            found.visit('', find_ref_callback, None)
            found = found_ref

        if not found and retry:
            # maybe just locatable from here not defined here.
            # this happens when the symbol is monikered, but the moniker path doesn't lead to the document where
            # the symbol is defined. it leads to the document from where the symbol can be found.
            # Ex.: resolvedFrom/Owner, while resolvedFrom is the Account that imports Owner.
            found = self._resolve_symbol_reference(res_opt, doc_best, initial_symbol, expected_type, False)

        if found and expected_type != CdmObjectType.ERROR:
            if expected_type in SYMBOL_TYPE_CHECK and SYMBOL_TYPE_CHECK[expected_type] != found.object_type:
                # special case for EntityRef, which can be an EntityDef or Projection or ConstantEntityDef
                # SYMBOL_TYPE_CHECK only checks for EntityDef, so we have to also check for Projection and ConstantEntityDef here
                if expected_type == CdmObjectType.ENTITY_REF and (
                        found.object_type == CdmObjectType.PROJECTION_DEF or found.object_type == CdmObjectType.CONSTANT_ENTITY_DEF):
                    return found
                type_name = ''.join([name.title() for name in expected_type.name.split('_')])
                logger.error(self.ctx, self._TAG, '_resolve_symbol_reference', wrt_doc.at_corpus_path,
                             CdmLogCode.ERR_UNEXPECTED_TYPE, type_name, symbol_def)
                found = None

        return found

    def set_event_callback(self, status: 'EventCallback', report_at_level: 'CdmStatusLevel' = CdmStatusLevel.INFO,
                           correlation_id: Optional[str] = None):
        '''A callback that gets called on an event.'''
        self.ctx.status_event = status
        self.ctx.report_at_level = report_at_level
        self.ctx.correlation_id = correlation_id

    def _set_import_documents(self, doc: 'CdmDocumentDefinition') -> None:
        if not doc.imports:
            return

        for imp in doc.imports:
            if not imp._document:
                # no document set for this import, see if it is already loaded into the corpus
                path = self.storage.create_absolute_corpus_path(imp.corpus_path, doc)
                imp_doc = self._document_library._fetch_document(path)
                if imp_doc:
                    imp._document = imp_doc
                    # repeat the process for the import documents
                    self._set_import_documents(imp._document)

    def _unregister_symbol(self, symbol_def: str, in_doc: 'CdmDocumentDefinition') -> None:
        docs = self._symbol_definitions.get(symbol_def)
        if docs and in_doc in docs:
            docs.remove(in_doc)

    def _unregister_definition_reference_documents(self, definition: 'CdmObject', kind: str) -> None:
        key = CdmCorpusDefinition._fetch_cache_key_from_object(definition, kind)
        self._definition_reference_symbols.pop(key, None)

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        warnings.warn('Function deprecated', DeprecationWarning)
        return False

    async def _compute_last_modified_time_async(self, corpus_path: str, obj: Optional['CdmObject'] = None) -> datetime:
        """Return last modified time of the file where the object at corpus path can be found."""
        curr_object = await self.fetch_object_async(corpus_path, obj, True)
        if curr_object:
            return await self._get_last_modified_time_from_object_async(curr_object)
        return None

    async def _get_last_modified_time_from_object_async(self, curr_object: 'CdmObject') -> datetime:
        """Return last modified time of the file where the input object can be found."""
        from cdm.objectmodel import CdmReferencedEntityDeclarationDefinition, CdmLocalEntityDeclarationDefinition
        referenced_entity = cast(CdmReferencedEntityDeclarationDefinition, curr_object) if isinstance(curr_object, CdmReferencedEntityDeclarationDefinition) else None

        if isinstance(curr_object, CdmContainerDefinition) or (referenced_entity and referenced_entity._is_virtual):
            namespace_path = referenced_entity._virtual_location if referenced_entity != None else curr_object.at_corpus_path
            # Remove namespace from path
            path_tuple = StorageUtils.split_namespace_path(namespace_path)
            if not path_tuple:
                logger.error(self.ctx, self._TAG, self._get_last_modified_time_from_object_async.__name__, curr_object.at_corpus_path,
                             CdmLogCode.ERR_STORAGE_NULL_CORPUS_PATH)
                return None

            cur_namespace = path_tuple[0]
            path = path_tuple[1]

            if isinstance(curr_object, CdmManifestDefinition) and cast(CdmManifestDefinition, curr_object)._is_virtual:
                path = cast(CdmManifestDefinition, curr_object)._virtual_location
            elif isinstance(curr_object, CdmLocalEntityDeclarationDefinition) and cast(CdmLocalEntityDeclarationDefinition, curr_object)._is_virtual:
                path = cast(CdmLocalEntityDeclarationDefinition, curr_object)._virtual_location

            adapter = self.storage.fetch_adapter(cur_namespace)
            if not adapter:
                logger.error(self.ctx, self._TAG, self._get_last_modified_time_from_object_async.__name__, curr_object.at_corpus_path,
                             CdmLogCode.ERR_ADAPTER_NOT_FOUND, cur_namespace)
                return None

            try:
                return await adapter.compute_last_modified_time_async(path)
            except Exception as e:
                logger.error(self.ctx, self._TAG, self._get_last_modified_time_from_object_async.__name__, curr_object.at_corpus_path,
                             CdmLogCode.ERR_MANIFEST_FILE_MOD_TIME_FAILURE, path, e)
                return None
        else:
            return await self._get_last_modified_time_from_object_async(curr_object.in_document)

    async def _get_last_modified_time_from_partition_path_async(self, corpus_path: str) -> datetime:
        """Return last modified time of a partition object."""
        file_metadata = await self._get_file_metadata_from_partition_path_async(corpus_path)

        if file_metadata is None:
            return None

        return file_metadata['last_modified_time']

    async def _get_file_metadata_from_partition_path_async(self, corpus_path: 'CdmObject') -> CdmFileMetadata:
        """Gets the file metadata of the partition without trying to read the file itself."""

        # We do not want to load partitions from file, just check the modified times.
        path_tuple = StorageUtils.split_namespace_path(corpus_path)
        if not path_tuple:
            logger.error(self.ctx, self._TAG, self._get_file_metadata_from_partition_path_async.__name__, corpus_path,
                         CdmLogCode.ERR_PATH_NULL_OBJECT_PATH)
            return None
        namespace = path_tuple[0]
        if namespace:
            adapter = self.storage.fetch_adapter(namespace)
        if not adapter:
            logger.error(self.ctx, self._TAG, self._get_file_metadata_from_partition_path_async.__name__, corpus_path,
                         CdmLogCode.ERR_ADAPTER_NOT_FOUND, namespace)
            return None
        try:
            return await adapter.fetch_file_metadata_async(path_tuple[1])
        except Exception as e:
            logger.error(self.ctx, self._TAG, self._get_file_metadata_from_partition_path_async.__name__, corpus_path,
                         CdmLogCode.ERR_PARTITION_FILE_MOD_TIME_FAILURE, path_tuple, e)
        return None

    @staticmethod
    def _fetch_cache_key_from_object(definition: 'CdmObject', kind: str) -> str:
        return '{}-{}'.format(definition.id, kind)

    @staticmethod
    def _fetch_priority_doc(docs: List['CdmDocumentDefinition'],
                            import_priority: Dict['CdmDocumentDefinition', 'ImportInfo']) -> 'CdmDocumentDefinition':
        doc_best = None
        index_best = None

        for doc_defined in docs:
            # is this one of the imported docs?
            import_info = import_priority.get(doc_defined, None)
            if import_info is not None and (index_best is None or import_info.priority < index_best):
                index_best = import_info.priority
                doc_best = doc_defined
                if index_best == 0:
                    #  hard to be better than the best
                    break

        return doc_best

    @staticmethod
    def _map_reference_type(of_type: 'CdmObjectType') -> 'CdmObjectType':
        if of_type in [CdmObjectType.ARGUMENT_DEF, CdmObjectType.DOCUMENT_DEF, CdmObjectType.MANIFEST_DEF,
                       CdmObjectType.IMPORT, CdmObjectType.PARAMETER_DEF]:
            return CdmObjectType.ERROR
        if of_type in [CdmObjectType.ATTRIBUTE_GROUP_REF, CdmObjectType.ATTRIBUTE_GROUP_DEF]:
            return CdmObjectType.ATTRIBUTE_GROUP_REF
        if of_type in [CdmObjectType.CONSTANT_ENTITY_DEF, CdmObjectType.ENTITY_DEF, CdmObjectType.ENTITY_REF]:
            return CdmObjectType.ENTITY_REF
        if of_type in [CdmObjectType.DATA_TYPE_DEF, CdmObjectType.DATA_TYPE_REF]:
            return CdmObjectType.DATA_TYPE_REF
        if of_type in [CdmObjectType.PURPOSE_DEF, CdmObjectType.PURPOSE_REF]:
            return CdmObjectType.PURPOSE_REF
        if of_type in [CdmObjectType.TRAIT_DEF, CdmObjectType.TRAIT_REF]:
            return CdmObjectType.TRAIT_REF
        if of_type in [CdmObjectType.TRAIT_GROUP_DEF, CdmObjectType.TRAIT_GROUP_REF]:
            return CdmObjectType.TRAIT_GROUP_REF
        if of_type in [CdmObjectType.ENTITY_ATTRIBUTE_DEF, CdmObjectType.TYPE_ATTRIBUTE_DEF,
                       CdmObjectType.ATTRIBUTE_REF]:
            return CdmObjectType.ATTRIBUTE_REF
        if of_type in [CdmObjectType.ATTRIBUTE_CONTEXT_DEF, CdmObjectType.ATTRIBUTE_CONTEXT_REF]:
            return CdmObjectType.ATTRIBUTE_CONTEXT_REF

        return CdmObjectType.ERROR

    async def fetch_object_async(self, object_path: str, relative_object: Optional['CdmObject'] = None,
                                 shallow_validation: Optional[bool] = None,
                                 force_reload: Optional[bool] = False, res_opt: Optional['ResolveOptions'] = None) -> Optional['CdmObject']:
        """gets an object by the path from the Corpus."""
        from cdm.persistence import PersistenceLayer

        with logger._enter_scope(self._TAG, self.ctx, self.fetch_object_async.__name__):

            if res_opt is None:
                res_opt = ResolveOptions()

            if shallow_validation is not None:
                if isinstance(shallow_validation, ResolveOptions):
                    raise Exception('ResolveOptions is not the third parameter in Python, please specify the parameter name when you pass in ResolveOptions.')

                res_opt = res_opt.copy()
                res_opt.shallow_validation = shallow_validation

            object_path = self.storage.create_absolute_corpus_path(object_path, relative_object)
            document_path = object_path
            document_name_index = object_path.rfind(PersistenceLayer.CDM_EXTENSION)

            if document_name_index != -1:
                # if there is something after the document path, split it into document path and object path.
                document_name_index += len(PersistenceLayer.CDM_EXTENSION)
                document_path = object_path[0: document_name_index]

            logger.debug(self.ctx, self._TAG, self.fetch_object_async.__name__, object_path,
                         'request object: {}'.format(object_path))
            obj = await self._document_library._load_folder_or_document(document_path, force_reload)

            if not obj:
                return None

            # get imports and index each document that is loaded
            if isinstance(obj, CdmDocumentDefinition):
                if not await obj._index_if_needed(res_opt):
                    return None
                if not obj._is_valid:
                    logger.error(self.ctx, self._TAG, self.fetch_object_async.__name__, obj.at_corpus_path,
                                 CdmLogCode.ERR_VALDN_INVALID_DOC, object_path)
                    return None

            # Import here to avoid circular import
            from .cdm_entity_def import CdmEntityDefinition
            from .cdm_manifest_def import CdmManifestDefinition

            if document_path == object_path:
                # Log the telemetry if the document is a manifest
                if isinstance(obj, CdmManifestDefinition):
                    logger._ingest_manifest_telemetry(obj, self.ctx, CdmCorpusDefinition.__name__,
                                                      self.fetch_object_async.__name__, obj.at_corpus_path)

                return obj

            if document_name_index == -1:
                # there is no remaining path to be loaded, so return.
                return None

            # trim off the document path to get the object path in the doc
            remaining_object_path = object_path[document_name_index + 1:]

            result = obj._fetch_object_from_document_path(remaining_object_path, res_opt)
            if not result:
                logger.error(self.ctx, self._TAG, self.fetch_object_async.__name__, obj.at_corpus_path, CdmLogCode.ERR_DOC_SYMBOL_NOT_FOUND,
                             remaining_object_path, obj.at_corpus_path)
            else:
                # Log the telemetry if the object is a manifest
                if isinstance(result, CdmManifestDefinition):
                    logger._ingest_manifest_telemetry(result, self.ctx, CdmCorpusDefinition.__name__,
                                                      self.fetch_object_async.__name__, obj.at_corpus_path)

                # Log the telemetry if the object is an entity
                elif isinstance(result, CdmEntityDefinition):
                    logger._ingest_entity_telemetry(result, self.ctx, CdmCorpusDefinition.__name__,
                                                    self.fetch_object_async.__name__, obj.at_corpus_path)

            return result

    def _is_path_manifest_document(self, path: str) -> bool:
        from cdm.persistence import PersistenceLayer

        return path.endswith(PersistenceLayer.FOLIO_EXTENSION) or path.endswith(PersistenceLayer.MANIFEST_EXTENSION) \
            or path.endswith(PersistenceLayer.MODEL_JSON_EXTENSION)

    def fetch_incoming_relationships(self, entity: 'CdmEntityDefinition') -> List['E2ERelationshipDef']:
        return self._incoming_relationships.get(entity.at_corpus_path, [])

    def fetch_outgoing_relationships(self, entity: 'CdmEntityDefinition') -> List['E2ERelationshipDef']:
        return self._outgoing_relationships.get(entity.at_corpus_path, [])

    def _get_from_attributes(self, new_gen_set: 'CdmAttributeContext', from_attrs: List['CdmAttributeReference']) -> \
            List['CdmAttributeReference']:
        """For Projections get the list of 'From' Attributes"""
        if new_gen_set and new_gen_set.contents:
            if not from_attrs:
                from_attrs = []

            for sub in new_gen_set.contents:
                if sub.object_type == CdmObjectType.ATTRIBUTE_CONTEXT_DEF:
                    sub_ctx = sub
                    from_attrs = self._get_from_attributes(sub_ctx, from_attrs)
                elif sub.object_type == CdmObjectType.ATTRIBUTE_REF:
                    from_attrs.append(sub)

        return from_attrs

    def _get_to_attributes(self, from_attr_def: 'CdmTypeAttributeDefinition', res_opt: 'ResolveOptions') \
            -> Optional[List[Tuple[str, str, str]]]:
        """For Projections get the list of 'To' Attributes"""
        if from_attr_def and from_attr_def.applied_traits:
            tuple_list = []
            for trait in from_attr_def.applied_traits:
                if trait.named_reference == 'is.linkedEntity.identifier' and len(trait.arguments) > 0:
                    const_ent = trait.arguments[0].value.fetch_object_definition(res_opt)
                    if const_ent and const_ent.constant_values:
                        for constant_values in const_ent.constant_values:
                            tuple_list.append((constant_values[0], constant_values[1],
                                               constant_values[2] if len(constant_values) > 2 else ''))
            return tuple_list
        return None

    async def _prepare_artifact_attributes_async(self) -> bool:
        """
        Fetches from primitives or creates the default attributes that get added by resolution
        """
        if not self._known_artifact_attributes:
            self._known_artifact_attributes = OrderedDict()
            # see if we can get the value from primitives doc
            # this might fail, and we do not want the user to know about it.
            old_status = self.ctx.status_event  # todo, we should make an easy way for our code to do this and set it back
            old_level = self.ctx.report_at_level

            def callback(level: CdmStatusLevel, message: str):
                return

            self.set_event_callback(callback, CdmStatusLevel.ERROR)

            try:
                default_artifact_path = 'cdm:/primitives.cdm.json/defaultArtifacts'
                ent_art = await self.fetch_object_async(
                    default_artifact_path)  # type: CdmEntityDefinition
                if not isinstance(ent_art, CdmEntityDefinition):
                    logger.error(self.ctx, self._TAG, self.calculate_entity_graph_async.__name__, None,
                                 CdmLogCode.ERR_INVALID_CAST, default_artifact_path, 'CdmEntityDefinition')
                    ent_art = None
            finally:
                self.set_event_callback(old_status, old_level)

            if not ent_art:
                # fallback to the old ways, just make some
                art_att = self.make_object(CdmObjectType.TYPE_ATTRIBUTE_DEF,
                                           'count')  # type: CdmTypeAttributeDefinition
                art_att.data_type = self.make_object(CdmObjectType.DATA_TYPE_REF, 'integer', True)
                self._known_artifact_attributes['count'] = art_att
                art_att = self.make_object(CdmObjectType.TYPE_ATTRIBUTE_DEF, 'id')
                art_att.data_type = self.make_object(CdmObjectType.DATA_TYPE_REF, 'entityId', True)
                self._known_artifact_attributes['id'] = art_att
                art_att = self.make_object(CdmObjectType.TYPE_ATTRIBUTE_DEF, 'type')
                art_att.data_type = self.make_object(CdmObjectType.DATA_TYPE_REF, 'entityName', True)
                self._known_artifact_attributes['type'] = art_att
            else:
                # point to the ones from the file
                from .cdm_attribute_def import CdmAttribute
                from .cdm_type_attribute_def import CdmTypeAttributeDefinition
                for att in ent_art.attributes:
                    self._known_artifact_attributes[cast(CdmAttribute, att).name] = cast(CdmTypeAttributeDefinition,
                                                                                         att)

        return True

    def _fetch_artifact_attribute(self, name: str) -> 'CdmTypeAttributeDefinition':
        """
        Returns the (previously prepared) artifact attribute of the known name
        """
        if not self._known_artifact_attributes:
            return None  # this is a usage mistake. never call this before success from the _prepare_artifact_attributes_async

        return cast('CdmTypeAttributeDefinition', self._known_artifact_attributes[name].copy())
