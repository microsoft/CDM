# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import asyncio
from collections import defaultdict, OrderedDict
from datetime import datetime
from typing import cast, Callable, Dict, List, Optional, Set, TypeVar, Union, TYPE_CHECKING, Tuple
import warnings

import nest_asyncio

from cdm.storage import StorageManager
from cdm.enums import CdmAttributeContextType, CdmObjectType, CdmStatusLevel, CdmValidationStep, ImportsLoadStrategy
from cdm.objectmodel import CdmContainerDefinition
from cdm.utilities import AttributeResolutionDirectiveSet, DepthInfo, DocsResult, ImportInfo, ResolveOptions, StorageUtils, SymbolSet, logger

from .cdm_attribute_ref import CdmAttributeReference
from .cdm_corpus_context import CdmCorpusContext
from .cdm_document_def import CdmDocumentDefinition
from .cdm_e2e_relationship import CdmE2ERelationship
from .cdm_object import CdmObject
from .cdm_object_ref import CdmObjectReference
from ._document_library import DocumentLibrary

if TYPE_CHECKING:
    from cdm.objectmodel import CdmArgumentValue, CdmAttributeContext, CdmDocumentDefinition, CdmEntityDefinition, \
        CdmEntityReference, CdmLocalEntityDeclarationDefinition, CdmManifestDefinition, CdmObject, CdmObjectDefinition, \
        CdmObjectReference, CdmParameterDefinition, CdmTypeAttributeDefinition
    from cdm.storage import StorageAdapterBase
    from cdm.utilities import CdmError, CopyOptions, EventCallback

    TObject = TypeVar('TObject', bound=CdmObject)
    TObjectRef = TypeVar('TObjectRef', bound=CdmObjectReference)


SYMBOL_TYPE_CHECK = {
    CdmObjectType.TRAIT_REF: CdmObjectType.TRAIT_DEF,
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
}


class CdmCorpusDefinition:

    def __init__(self):
        from cdm.persistence import PersistenceLayer

        # the corpus root path.
        self.root_path = None  # type: Optional[str]

        self.ctx = CdmCorpusContext(self, None)

        # the app ID, optional property.
        self.app_id = None  # type: Optional[str]

        # --- internal ---

        # whether we are currently performing a resolution or not.
        # used to stop making documents dirty during CdmCollections operations.
        self._is_currently_resolving = False  # type: bool

        # used by visit functions of CdmObjects to skip calculating the declaredPath.
        self._block_declared_path_changes = False  # type: bool

        # The set of resolution directives that will be used by default by the object model when it is resolving
        # entities and when no per-call set of directives is provided.
        self.default_resolution_directives = AttributeResolutionDirectiveSet({'normalized', 'referenceOnly'})  # type: AttributeResolutionDirectiveSet

        self._symbol_definitions = {}  # type: Dict[str, List[CdmDocumentDefinition]]
        self._incoming_relationships = defaultdict(list)  # type: Dict[CdmObjectDefinition, List[CdmE2ERelationship]]
        self._outgoing_relationships = defaultdict(list)  # type: Dict[CdmObjectDefinition, List[CdmE2ERelationship]]
        self._definition_reference_symbols = {}  # type: Dict[str, SymbolSet]
        self._empty_rts = {}  # type: Dict[str, ResolvedTraitSet]
        self._document_library = DocumentLibrary()
        self._storage = StorageManager(self)
        self._persistence = PersistenceLayer(self)
        self._res_ent_map = defaultdict(str)  # type: Dict[str, str]
        self._root_manifest = None  # type: Optional[CdmManifestDefinition]
        self._known_artifact_attributes = None  # type: Optional[Dict[str, CdmTypeAttributeDefinition]]
        self._TAG = CdmCorpusDefinition.__name__

    @property
    def storage(self) -> 'StorageManager':
        return self._storage

    @property
    def persistence(self) -> 'PersistenceLayer':
        return self._persistence

    def _add_document_objects(self, folder: 'CdmFolderDefinition', doc: 'CdmDocumentDefinition'):
        path = self.storage.create_absolute_corpus_path('{}{}'.format(doc.folder_path, doc.name), doc).lower()
        self._document_library._add_document_path(path, folder, doc)

        return doc

    async def calculate_entity_graph_async(self, curr_manifest: 'CdmManifestDefinition') -> None:
        """Calculate the entity to entity relationships for all the entities present in the folder and its sub folder."""
        for entity_dec in curr_manifest.entities:
            entity_path = await curr_manifest._get_entity_path_from_declaration(entity_dec, curr_manifest)
            entity = await self.fetch_object_async(entity_path)  # type: CdmEntityDefinition

            if entity is None:
                continue

            res_entity = None  # type: Optional[CdmEntityDefinition]
            # make options wrt this entity document and "relational" always
            res_opt = ResolveOptions(entity.in_document, AttributeResolutionDirectiveSet({'normalized', 'referenceOnly'}))

            is_resolved_entity = entity.attribute_context is not None

            # only create a resolved entity if the entity passed in was not a resolved entity
            if not is_resolved_entity:
                # first get the resolved entity so that all of the references are present
                res_entity = await entity.create_resolved_entity_async('wrtSelf_' + entity.entity_name, res_opt)
            else:
                res_entity = entity

            # find outgoing entity relationships using attribute context
            outgoing_relationships = self._find_outgoing_relationships(
                res_opt, res_entity, res_entity.attribute_context, is_resolved_entity)  # type: List[CdmE2ERelationship]

            self._outgoing_relationships[entity] = outgoing_relationships

            # flip outgoing entity relationships list to get incoming relationships map
            if outgoing_relationships:
                for rel in outgoing_relationships:
                    target_ent = await self.fetch_object_async(rel.to_entity, curr_manifest)
                    self._incoming_relationships[target_ent].append(rel)

            # delete the resolved entity if we created one here
            if not is_resolved_entity:
                res_entity.in_document.folder.documents.remove(res_entity.in_document.name)

        for sub_manifest_def in curr_manifest.sub_manifests:
            sub_manifest = await self.fetch_object_async(sub_manifest_def.definition, curr_manifest)  # type: CdmManifestDefinition
            await self.calculate_entity_graph_async(sub_manifest)

    def _check_object_integrity(self, current_doc: 'CdmDocumentDefinition') -> bool:
        ctx = self.ctx
        error_count = 0

        def callback(obj: 'CdmObject', path: str) -> bool:
            nonlocal error_count
            if not obj.validate():
                error_count += 1
            else:
                obj.ctx = ctx

            logger.info(self._TAG, self.ctx, 'checked \'{}\''.format(current_doc.folder_path + path))

            return False

        current_doc.visit('', callback, None)

        return error_count == 0

    def _const_type_check(self, res_opt: 'ResolveOptions', current_doc: 'CdmDocumentDefinition', param_def: 'CdmParameterDefinition', a_value: 'CdmArgumentValue') -> 'CdmArgumentValue':
        ctx = self.ctx
        replacement = a_value
        # if parameter type is entity, then the value should be an entity or ref to one
        # same is true of 'dataType' dataType
        ref = param_def.data_type_ref
        if not ref:
            return replacement

        dt = ref.fetch_object_definition(res_opt)

        # compare with passed in value or default for parameter
        p_value = a_value
        if p_value is None:
            p_value = param_def.default_value
            replacement = p_value

        if p_value is not None:
            if dt.is_derived_from('cdmObject', res_opt):
                expected_types = []
                expected = None
                if dt.is_derived_from('entity', res_opt):
                    expected_types.append(CdmObjectType.CONSTANT_ENTITY_DEF)
                    expected_types.append(CdmObjectType.ENTITY_REF)
                    expected_types.append(CdmObjectType.ENTITY_DEF)
                    expected_types.append(CdmObjectType.PROJECTION_DEF)
                    expected = 'entity'
                elif dt.is_derived_from('attribute', res_opt):
                    expected_types.append(CdmObjectType.ATTRIBUTE_REF)
                    expected_types.append(CdmObjectType.TYPE_ATTRIBUTE_DEF)
                    expected_types.append(CdmObjectType.ENTITY_ATTRIBUTE_DEF)
                    expected = 'attribute'
                elif dt.is_derived_from('dataType', res_opt):
                    expected_types.append(CdmObjectType.DATA_TYPE_REF)
                    expected_types.append(CdmObjectType.DATA_TYPE_DEF)
                    expected = 'dataType'
                elif dt.is_derived_from('purpose', res_opt):
                    expected_types.append(CdmObjectType.PURPOSE_REF)
                    expected_types.append(CdmObjectType.PURPOSE_DEF)
                    expected = 'purpose'
                elif dt.is_derived_from('trait', res_opt):
                    expected_types.append(CdmObjectType.TRAIT_REF)
                    expected_types.append(CdmObjectType.TRAIT_DEF)
                    expected = 'trait'
                elif dt.is_derived_from('attributeGroup', res_opt):
                    expected_types.append(CdmObjectType.ATTRIBUTE_GROUP_REF)
                    expected_types.append(CdmObjectType.ATTRIBUTE_GROUP_DEF)
                    expected = 'attributeGroup'

                if not expected_types:
                    logger.error(self._TAG, self.ctx, 'parameter \'{}\' has an unexpected dataType.'.format(param_def.name), ctx._relative_path)

                # if a string constant, resolve to an object ref.
                found_type = CdmObjectType.ERROR
                if isinstance(p_value, CdmObject):
                    found_type = p_value.object_type

                found_desc = ctx._relative_path
                if isinstance(p_value, str):
                    if p_value == 'this.attribute' and expected == 'attribute':
                        # will get sorted out later when resolving traits
                        found_type = CdmObjectType.ATTRIBUTE_REF
                    else:
                        found_desc = p_value
                        seek_res_att = CdmObjectReference._offset_attribute_promise(p_value)
                        if seek_res_att >= 0:
                            # get an object there that will get resolved later after resolved attributes
                            replacement = CdmAttributeReference(self.ctx, p_value, True)
                            replacement.in_document = current_doc
                            found_type = CdmObjectType.ATTRIBUTE_REF
                        else:
                            lu = ctx.corpus._resolve_symbol_reference(res_opt, current_doc, p_value, CdmObjectType.ERROR, True)
                            if lu:
                                if expected == 'attribute':
                                    replacement = CdmAttributeReference(self.ctx, p_value, True)
                                    replacement.in_document = current_doc
                                    found_type = CdmObjectType.ATTRIBUTE_REF
                                else:
                                    replacement = lu
                                    if isinstance(replacement, CdmObject):
                                        found_type = replacement.object_type

                if expected_types.index(found_type) == -1:
                    logger.error(self._TAG, self.ctx,
                                 'parameter \'{0}\' has the dataType of \'{1}\' but the value \'{2}\' does\'t resolve to a known {1} referenece'
                                 .format(param_def.get_name(), expected, found_desc),
                                 current_doc.folder_path + ctx._relative_path)
                else:
                    logger.info(self._TAG, self.ctx, 'resolved \'{}\''.format(found_desc), ctx._relative_path)

        return replacement

    async def create_root_manifest_async(self, corpus_path: str) -> Optional['CdmManifestDefinition']:
        if self._is_path_manifest_document(corpus_path):
            self._root_manifest = await self.fetch_object_async(corpus_path)
            return self._root_manifest
        return None

    def _find_missing_imports_from_document(self, doc: 'CdmDocumentDefinition') -> None:
        """Find import objects for the document that have not been loaded yet"""
        if doc.imports:
            for imp in doc.imports:
                if not imp._document:
                    # no document set for this import, see if it is already loaded into the corpus
                    path = self.storage.create_absolute_corpus_path(imp.corpus_path, doc)
                    self._document_library._add_to_docs_not_loaded(path)

    def _get_attribute_name(self, named_reference):
        return named_reference[named_reference.rfind('/') + 1:]

    def _find_outgoing_relationships(self, res_opt: 'ResolveOptions', res_entity: 'CdmEntityDefinition', att_ctx: 'CdmAttributeContext',
                                     is_resolved_entity: Optional['bool'] = False, generated_att_set_context: Optional['CdmAttributeContext'] = None,
                                     was_projection_polymorphic: Optional[bool] = False,
                                     from_atts: List['CdmAttributeReference'] = None) -> List['CdmE2ERelationship']:
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
                            logger.error(self._TAG, self.ctx, 'Found object without owner when calculating relationships.')

                        # From the top of the projection (or the top most which contains a generatedSet / operations)
                        # get the attribute names for the foreign key
                        if new_gen_set and not from_atts:
                            from_atts = self._get_from_attributes(new_gen_set, from_atts)

                        out_rels = self._find_outgoing_relationships_for_projection(out_rels, child, res_opt, res_entity, from_atts)

                        was_projection_polymorphic = is_polymorphic_source
                    else:
                        # Non-Projections based approach and current as-is code path

                        is_entity_ref = True

                        to_att = [self._get_attribute_name(trait.arguments[0].value.named_reference) for trait in child.exhibits_traits
                                  if trait.fetch_object_definition_name() == 'is.identifiedBy' and trait.arguments]  # type: List[string]

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
                            is_entity_ref
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
                    from_atts
                )
                out_rels.extend(sub_out_rels)

                # if it was a projection-based polymorphic source up through this branch of the tree and currently it has reached the end of the projection tree to come to a non-projection source,
                # then skip adding just this one source and continue with the rest of the tree
                if skip_add:
                    # skip adding only this entry in the tree and continue with the rest of the tree
                    was_projection_polymorphic = False

        return out_rels

    def _find_outgoing_relationships_for_projection(
        self,
        out_rels: List['CdmE2ERelationship'],
        child: 'CdmAttributeContext',
        res_opt: 'ResolveOptions',
        res_entity: 'CdmEntityDefinition',
        from_atts: Optional[List['CdmAttributeReference']] = None
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
            unresolved_entity = ref_to_logical_entity.fetch_object_definition(res_opt_copy) if ref_to_logical_entity else None
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
                    new_e2e_rel.to_entity = self.storage.create_absolute_corpus_path(tuple[0], unresolved_entity)
                    new_e2e_rel.to_entity_attribute = tuple[1]

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
        was_entity_ref: Optional[bool] = False
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
                                                             CdmObjectType.TYPE_ATTRIBUTE_DEF, False)  # type: CdmTypeAttributeDefinition
                if att_from_fk is not None:
                    fk_arg_values = self._get_to_attributes(att_from_fk, resolved_res_opt)

                    for const_ent in fk_arg_values:
                        absolute_path = self.storage.create_absolute_corpus_path(const_ent[0], att_from_fk)
                        to_att_list.append((absolute_path, const_ent[1]))

                for attribute_tuple in to_att_list:
                    from_att = self._get_attribute_name(foreign_key).replace(child.name + '_', '')
                    new_e2e_relationship = CdmE2ERelationship(self.ctx, '')
                    new_e2e_relationship.from_entity_attribute = from_att
                    new_e2e_relationship.to_entity_attribute = attribute_tuple[1]

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

                        new_e2e_relationship.from_entity = self.storage.create_absolute_corpus_path(selected_ent_corpus_path, selected_entity)
                        new_e2e_relationship.to_entity = attribute_tuple[0]

                    # if it was a projection-based polymorphic source up through this branch of the tree and currently it has reached the end of the projection tree to come to a non-projection source,
                    # then skip adding just this one source and continue with the rest of the tree
                    if not (was_projection_polymorphic and was_entity_ref):
                        out_rels.append(new_e2e_relationship)

        return out_rels

    def _create_definition_cache_tag(self, res_opt: 'ResolveOptions', definition: 'CdmObject', kind: str, extra_tags: str = '',
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
        this_path = definition._declared_path.replace('/', '') if definition.object_type == CdmObjectType.PROJECTION_DEF else definition.at_corpus_path
        if path_to_def and not_known_to_have_parameters:
            this_id = path_to_def
        else:
            this_id = str(definition.id)

        tag_suffix = '-{}-{}'.format(kind, this_id)
        tag_suffix += '-({})'.format(res_opt.directives.get_tag() if res_opt.directives else '')
        if res_opt._depth_info.max_depth_exceeded:
            curr_depth_info = res_opt._depth_info
            tag_suffix += '-{}'.format(curr_depth_info.max_depth - curr_depth_info.current_depth)
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
                        doc_best = CdmCorpusDefinition._fetch_priority_doc(docs_res.doc_list, wrt_doc._import_priorities.import_priority)
                        if doc_best:
                            found_doc_ids.add(str(doc_best.id))

            found_doc_ids_list = list(found_doc_ids)
            found_doc_ids_list.sort()
            tag_pre = '-'.join(found_doc_ids_list)

            return tag_pre + tag_suffix

        return None

    def _index_documents(self, res_opt: 'ResolveOptions', load_imports: bool) -> bool:
        docs_not_indexed = self._document_library._list_docs_not_indexed()  # type: Set[CdmDocumentDefinition]

        if not docs_not_indexed:
            return True

        for doc in docs_not_indexed:
            if not doc._declarations_indexed:
                logger.debug(self._TAG, self.ctx, 'index start: {}'.format(doc.at_corpus_path), self._index_documents.__name__)
                doc._clear_caches()

        # check basic integrity
        for doc in docs_not_indexed:
            if not doc._declarations_indexed:
                doc._is_valid = self._check_object_integrity(doc)

        # declare definitions of objects in this doc
        for doc in docs_not_indexed:
            if not doc._declarations_indexed and doc._is_valid:
                self._declare_object_definitions(doc, '')

        if load_imports:
            # index any imports
            for doc in docs_not_indexed:
                doc._get_import_priorities()

            # make sure we can find everything that is named by reference
            for doc in docs_not_indexed:
                if doc._is_valid:
                    res_opt_local = res_opt.copy()
                    res_opt_local.wrt_doc = doc
                    self._resolve_object_definitions(res_opt_local, doc)

            # now resolve any trait arguments that are type object
            for doc in docs_not_indexed:
                res_opt_local = res_opt.copy()
                res_opt_local.wrt_doc = doc
                self._resolve_trait_arguments(res_opt_local, doc)

        # finish up
        # make a copy to avoid error iterating over set that is modified in loop
        for doc in docs_not_indexed.copy():
            logger.debug(self._TAG, self.ctx, 'index finish: {}'.format(doc.at_corpus_path), self._index_documents.__name__)
            self._finish_document_resolve(doc, load_imports)

        return True

    def _declare_object_definitions(self, current_doc: 'CdmDocumentDefinition', relative_path: str) -> None:
        ctx = self.ctx
        # TODO: find a better solution for this set
        skip_duplicate_types = set([CdmObjectType.ATTRIBUTE_GROUP_REF, CdmObjectType.ATTRIBUTE_CONTEXT_REF, CdmObjectType.DATA_TYPE_REF,
                                    CdmObjectType.ENTITY_REF, CdmObjectType.PURPOSE_REF, CdmObjectType.TRAIT_REF, CdmObjectType.CONSTANT_ENTITY_DEF])
        internal_declaration_types = set([CdmObjectType.ENTITY_DEF, CdmObjectType.PARAMETER_DEF, CdmObjectType.TRAIT_DEF, CdmObjectType.PURPOSE_DEF,
                                          CdmObjectType.DATA_TYPE_DEF, CdmObjectType.TYPE_ATTRIBUTE_DEF, CdmObjectType.ENTITY_ATTRIBUTE_DEF,
                                          CdmObjectType.ATTRIBUTE_GROUP_DEF, CdmObjectType.CONSTANT_ENTITY_DEF, CdmObjectType.ATTRIBUTE_CONTEXT_DEF,
                                          CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF, CdmObjectType.REFERENCED_ENTITY_DECLARATION_DEF,
                                          CdmObjectType.ATTRIBUTE_GROUP_REF, CdmObjectType.ATTRIBUTE_CONTEXT_REF, CdmObjectType.DATA_TYPE_REF,
                                          CdmObjectType.ENTITY_REF, CdmObjectType.PURPOSE_REF, CdmObjectType.TRAIT_REF, CdmObjectType.ATTRIBUTE_GROUP_DEF,
                                          CdmObjectType.PROJECTION_DEF, CdmObjectType.OPERATION_ADD_COUNT_ATTRIBUTE_DEF, CdmObjectType.OPERATION_ADD_SUPPORTING_ATTRIBUTE_DEF,
                                          CdmObjectType.OPERATION_ADD_TYPE_ATTRIBUTE_DEF, CdmObjectType.OPERATION_EXCLUDE_ATTRIBUTES_DEF, CdmObjectType.OPERATION_ARRAY_EXPANSION_DEF,
                                          CdmObjectType.OPERATION_COMBINE_ATTRIBUTES_DEF, CdmObjectType.OPERATION_RENAME_ATTRIBUTES_DEF, CdmObjectType.OPERATION_REPLACE_AS_FOREIGN_KEY_DEF,
                                          CdmObjectType.OPERATION_INCLUDE_ATTRIBUTES_DEF, CdmObjectType.OPERATION_ADD_ATTRIBUTE_GROUP_DEF])

        def callback(obj: 'CdmObject', path: str) -> bool:
            # I can't think of a better time than now to make sure any recently changed or added things have an in doc
            obj.in_document = current_doc

            if path.find('(unspecified)') > 0:
                return True

            skip_duplicates = False
            if obj.object_type in skip_duplicate_types:
                # these are all references
                # we will now allow looking up a reference object based on path, so they get indexed too
                # if there is a duplicate, don't complain, the path just finds the first one
                skip_duplicates = True
            if obj.object_type in internal_declaration_types:
                ctx._relative_path = relative_path

                corpus_path = '{}/{}'.format(corpus_path_root, path)
                if path in current_doc.internal_declarations and not skip_duplicates:
                    logger.error(self._TAG, self.ctx, 'duplicate declaration for item \'{}\''.format(path), corpus_path)
                    return False
                else:
                    current_doc.internal_declarations[path] = obj
                    self._register_symbol(path, current_doc)

                    logger.info(self._TAG, self.ctx, 'declared \'{}\''.format(path), corpus_path)

            return False

        corpus_path_root = current_doc.folder_path + current_doc.name
        current_doc.visit(relative_path, callback, None)

    def _docs_for_symbol(self, res_opt: 'ResolveOptions', wrt_doc: 'CdmDocumentDefinition', from_doc: 'CdmDocumentDefinition', symbol_def: str) -> DocsResult:
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
                logger.error(self._TAG, self.ctx, 'no support for absolute references yet. fix \'{}\''.format(symbol_def), ctx._relative_path)

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
                    if result.new_symbol.find('/') >= 0 and (using_wrt_doc or result.new_symbol not in self._symbol_definitions):
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

    def _finish_document_resolve(self, doc: 'CdmDocumentDetinition', loaded_imports: bool) -> None:
        was_indexed_previously = doc._declarations_indexed

        doc._currently_indexing = False
        doc._imports_indexed = doc._imports_indexed or loaded_imports
        doc._declarations_indexed = True
        doc._needs_indexing = not loaded_imports
        self._document_library._mark_document_as_indexed(doc)

        # if the document declarations were indexed previously, do not log again.
        if not was_indexed_previously and doc._is_valid:
            for definition in doc.definitions:
                if definition.object_type == CdmObjectType.ENTITY_DEF:
                    logger.debug(self._TAG, self.ctx, 'indexed entity: {}'.format(definition.at_corpus_path))

    def _finish_resolve(self) -> None:
        #  cleanup references
        logger.debug(self._TAG, self.ctx, 'finishing...')

        # turn elevated traits back on, they are off by default and should work fully now that everything is resolved
        all_documents = self._document_library._list_all_documents()
        for fd in all_documents:
            self._finish_document_resolve(fd[1], False)

    async def _load_folder_or_document(self, object_path: str, force_reload: Optional[bool] = False, res_opt: Optional['ResolveOptions'] = None) -> Optional['CdmContainerDefinition']:
        if not object_path:
            return None

        # first check for namespace
        path_tuple = StorageUtils.split_namespace_path(object_path)
        if not path_tuple:
            logger.error(self._TAG, self.ctx, 'The object path cannot be null or empty.', self._load_folder_or_document.__name__)
            return None
        namespace = path_tuple[0] or self.storage.default_namespace
        object_path = path_tuple[1]

        if object_path.find('/') == 0:
            namespace_folder = self.storage.fetch_root_folder(namespace)
            namespace_adapter = self.storage.fetch_adapter(namespace)
            if not namespace_folder or not namespace_adapter:
                logger.error(self._TAG, self.ctx, 'The namespace "{}" has not been registered'.format(namespace),
                             '{}({})'.format(self._load_folder_or_document.__name__, object_path))

                return None

            last_folder = namespace_folder._fetch_child_folder_from_path(object_path, False)

            # don't create new folders, just go as far as possible
            if last_folder:
                # maybe the search is for a folder?
                last_path = last_folder.folder_path
                if last_path == object_path:
                    return last_folder

                # remove path to folder and then look in the folder
                object_path = object_path[len(last_path):]

                return await last_folder._fetch_document_from_folder_path_async(object_path, namespace_adapter, force_reload, res_opt)

        return None

    async def _load_imports_async(self, doc: 'CdmDocumentDefinition', res_opt: 'ResolveOptions') -> None:
        docs_now_loaded = set()  # type: Set[CdmDocumentDefinition]
        docs_not_loaded = self._document_library._list_docs_not_loaded()

        if not docs_not_loaded:
            return

        async def load_docs(missing: str) -> None:
            if self._document_library._need_to_load_document(missing, docs_now_loaded):
                self._document_library._concurrent_read_lock.acquire()
                # load it
                new_doc = await self._load_folder_or_document(missing, False, res_opt)  # type: CdmDocumentDefinition

                if self._document_library._mark_document_as_loaded_or_failed(new_doc, missing, docs_now_loaded):
                    logger.info(self._TAG, self.ctx, 'resolved import for \'{}\''.format(new_doc.name), doc.at_corpus_path)
                else:
                    logger.warning(self._TAG, self.ctx, 'unable to resolve import for \'{}\''.format(missing), doc.at_corpus_path)
                self._document_library._concurrent_read_lock.release()

        task_list = [load_docs(missing) for missing in docs_not_loaded]

        # wait for all of the missing docs to finish loading
        await asyncio.gather(*task_list)

        # now that we've loaded new docs, find imports from them that need loading
        for loaded_doc in docs_now_loaded:
            self._find_missing_imports_from_document(loaded_doc)

        # repeat self process for the imports of the imports
        import_task_list = [self._load_imports_async(loaded_doc, res_opt) for loaded_doc in docs_now_loaded]
        await asyncio.gather(*import_task_list)

    def make_object(self, of_type: 'CdmObjectType', name_or_ref: str = None, simple_name_ref: bool = False) -> 'TObject':
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

    def _register_definition_reference_symbols(self, definition: 'CdmObject', kind: str, symbol_ref_set: 'SymbolSet') -> None:
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

    def _remove_document_objects(self, folder: 'CdmFolderDefinition', doc_def: 'CdmDocumentDefinition') -> None:
        doc = cast('CdmDocumentDefinition', doc_def)
        # the field defintion_wrt_tag has been removed
        # Don't worry about defintion_wrt_tag because it uses the doc ID that won't get re-used in this session unless
        # there are more than 4 billion objects every symbol defined in this document is pointing at the document, so
        # remove from cache. Also remove the list of docs that it depends on.
        self._remove_object_definitions(doc)

        # Remove from path lookup, folder lookup and global list of documents.
        path = self.storage.create_absolute_corpus_path(doc.folder_path + doc.name, doc).lower()
        self._document_library._remove_document_path(path, folder, doc)

    def _remove_object_definitions(self, doc: CdmDocumentDefinition) -> None:
        def visit_callback(i_object: 'CdmObject', path: str) -> bool:
            if path.find('(unspecified)') > 0:
                return True

            if i_object.object_type in [CdmObjectType.ENTITY_DEF, CdmObjectType.PARAMETER_DEF, CdmObjectType.TRAIT_DEF, CdmObjectType.PURPOSE_DEF,
                                        CdmObjectType.DATA_TYPE_DEF, CdmObjectType.TYPE_ATTRIBUTE_DEF, CdmObjectType.ENTITY_ATTRIBUTE_DEF, CdmObjectType.ATTRIBUTE_GROUP_DEF,
                                        CdmObjectType.CONSTANT_ENTITY_DEF, CdmObjectType.ATTRIBUTE_CONTEXT_DEF, CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF,
                                        CdmObjectType.REFERENCED_ENTITY_DECLARATION_DEF, CdmObjectType.PROJECTION_DEF, CdmObjectType.OPERATION_ADD_COUNT_ATTRIBUTE_DEF,
                                        CdmObjectType.OPERATION_ADD_SUPPORTING_ATTRIBUTE_DEF, CdmObjectType.OPERATION_ADD_TYPE_ATTRIBUTE_DEF, CdmObjectType.OPERATION_EXCLUDE_ATTRIBUTES_DEF,
                                        CdmObjectType.OPERATION_ARRAY_EXPANSION_DEF, CdmObjectType.OPERATION_COMBINE_ATTRIBUTES_DEF, CdmObjectType.OPERATION_RENAME_ATTRIBUTES_DEF,
                                        CdmObjectType.OPERATION_REPLACE_AS_FOREIGN_KEY_DEF, CdmObjectType.OPERATION_INCLUDE_ATTRIBUTES_DEF, CdmObjectType.OPERATION_ADD_ATTRIBUTE_GROUP_DEF]:
                self._unregister_symbol(path, doc)
                self._unregister_definition_reference_documents(i_object, 'rasb')

            return False

        doc.visit('', visit_callback, None)

    async def _resolve_imports_async(self, doc: 'CdmDocumentDefinition', res_opt: 'ResolveOptions') -> None:
        """takes a callback that askes for promise to do URI resolution."""
        # find imports for this doc
        self._find_missing_imports_from_document(doc)
        # load imports (and imports of imports)
        await self._load_imports_async(doc, res_opt)
        # now that everything is loaded, attach import docs to this doc's import list
        self._set_import_documents(doc)

    async def resolve_references_and_validate_async(self, stage: 'CdmValidationStep',
                                                    stage_through: 'CdmValidationStep', res_opt: Optional['ResolveOptions'] = None) -> 'CdmValidationStep':
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
            self._resolve_references_step('resolving traits...', self._resolve_traits, res_opt, False, finish_resolve, CdmValidationStep.TRAITS)
            return self._resolve_references_step('checking required arguments...', self._resolve_references_traits_arguments,
                                                 res_opt, True, finish_resolve, CdmValidationStep.ATTRIBUTES)

        switcher = {
            CdmValidationStep.START: lambda: self._resolve_references_step('defining traits...', lambda *args: None, res_opt, True,
                                                                           finish_resolve or stage_through == CdmValidationStep.MINIMUM_FOR_RESOLVING, CdmValidationStep.TRAITS),
            CdmValidationStep.TRAITS: traits_step,
            CdmValidationStep.ATTRIBUTES: lambda: self._resolve_references_step('resolving attributes...',
                                                                                self._resolve_attributes, res_opt, True, finish_resolve, CdmValidationStep.ENTITY_REFERENCES),
            CdmValidationStep.ENTITY_REFERENCES: lambda: self._resolve_references_step('resolving foreign key references...',
                                                                                       self._resolve_foreign_key_references, res_opt, True, True, CdmValidationStep.FINISHED)
        }

        switcher[CdmValidationStep.TRAIT_APPLIERS] = switcher[CdmValidationStep.START]

        func = switcher.get(stage, lambda: CdmValidationStep.ERROR)

        # bad step sent in
        return func()

    def _resolve_references_step(self, status_message: str, resolve_action: Callable, resolve_opt: 'ResolveOptions',
                                 stage_finished: bool, finish_resolve: bool, next_stage: 'CdmValidationStep') -> 'CdmValidationStep':
        logger.debug(self._TAG, self.ctx, status_message)
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

    def _resolve_foreign_key_references(self, current_doc: 'CdmDocumentDefinition', res_opt: 'ResolveOptions', entity_nesting: List[int]) -> None:
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

    def _resolve_attributes(self, current_doc: 'CdmDocumentDefinition', res_opt: 'ResolveOptions', entity_nesting: List[int]) -> None:
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

    def _resolve_references_traits_arguments(self, current_doc: 'CdmDocumentDefinition', res_opt: 'ResolveOptions', entity_nesting: List[int]) -> None:
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
                                logger.error(self._TAG, self.ctx, 'no argument supplied for required parameter \'{}\' of trait \'{}\' on \'{}\''.
                                             format(param.name, rt.trait_name, defi.get_name()), current_doc.folder_path + ctx._relative_path)
                            else:
                                resolved += 1
                if found > 0 and found == resolved:
                    defi = obj.fetch_object_definition(res_opt)
                    logger.info(self._TAG, self.ctx, 'found and resolved \'{}\' required parameters of trait \'{}\' on \'{}\''.
                                format(found, rt.trait_name, defi.get_name()), current_doc.folder_path + ctx._relative_path)

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

    def _resolve_traits(self, current_doc: 'CdmDocumentDefinition', res_opt: 'ResolveOptions', entity_nesting: List[int]) -> None:
        ctx = self.ctx
        nesting = entity_nesting[0]

        def pre_visit(obj: 'CdmObject', path: str) -> bool:
            nonlocal ctx, nesting
            if obj.object_type == CdmObjectType.TRAIT_DEF or obj.object_type == CdmObjectType.PURPOSE_DEF or obj.object_type == CdmObjectType.DATA_TYPE_DEF or \
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

        if not res_opt or not res_opt.wrt_doc:
            # no way to figure this out
            return None

        wrt_doc = res_opt.wrt_doc

        loop = asyncio.get_event_loop()
        nest_asyncio.apply(loop)
        if not loop.run_until_complete(wrt_doc._index_if_needed(res_opt, True)):
            logger.error(self._TAG, self.ctx, 'Couldn\'t index source document.', '_resolve_symbol_reference')
            return None

        if wrt_doc._needs_indexing and res_opt.imports_load_strategy == ImportsLoadStrategy.DO_NOT_LOAD:
            logger.error(self._TAG, self.ctx,
                         'Cannot find symbol definition \'{}\' because the ImportsLoadStrategy is set to DO_NOT_LOAD'.format(symbol_def),
                         '_resolve_symbol_reference')
            return None

        # get the array of documents where the symbol is defined
        symbol_docs_result = self._docs_for_symbol(res_opt, wrt_doc, from_doc, symbol_def)
        doc_best = symbol_docs_result.doc_best
        symbol_def = symbol_docs_result.new_symbol
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
        if not found and retry:
            # maybe just locatable from here not defined here.
            # this happens when the symbol is monikered, but the moniker path doesn't lead to the document where the symbol is defined.
            # it leads to the document from where the symbol can be found.
            # Ex.: resolvedFrom/Owner, while resolvedFrom is the Account that imports Owner.
            found = self._resolve_symbol_reference(res_opt, doc_best, symbol_def, expected_type, False)

        if found and expected_type != CdmObjectType.ERROR:
            if expected_type in SYMBOL_TYPE_CHECK and SYMBOL_TYPE_CHECK[expected_type] != found.object_type:
                # special case for EntityRef, which can be an EntityDef or Projection or ConstantEntityDef
                # SYMBOL_TYPE_CHECK only checks for EntityDef, so we have to also check for Projection and ConstantEntityDef here
                if expected_type == CdmObjectType.ENTITY_REF and (found.object_type == CdmObjectType.PROJECTION_DEF or found.object_type == CdmObjectType.CONSTANT_ENTITY_DEF):
                    return found
                type_name = ''.join([name.title() for name in expected_type.name.split('_')])
                logger.error(self._TAG, self.ctx, 'expected type {}'.format(type_name), symbol_def)
                found = None

        return found

    def _resolve_object_definitions(self, res_opt: 'ResolveOptions', current_doc: 'CdmDocumentDefinition') -> None:
        ctx = self.ctx
        res_opt._indexing_doc = current_doc
        reference_type_set = set([
            CdmObjectType.ATTRIBUTE_REF, CdmObjectType.ATTRIBUTE_GROUP_REF, CdmObjectType.ATTRIBUTE_CONTEXT_REF,
            CdmObjectType.DATA_TYPE_REF, CdmObjectType.ENTITY_REF, CdmObjectType.PURPOSE_REF, CdmObjectType.TRAIT_REF
        ])

        def pre_callback(obj: 'CdmObjectReference', path: str) -> bool:
            if obj.object_type in reference_type_set:
                ctx._relative_path = path

                if CdmObjectReference._offset_attribute_promise(obj.named_reference) < 0:
                    res_new = obj._fetch_resolved_reference(res_opt)

                    if not res_new:
                        message = 'Unable to resolve the reference \'{}\' to a known object'.format(obj.named_reference)
                        message_path = current_doc.folder_path + path

                        # it's okay if references can't be resolved when shallow validation is enabled.
                        if res_opt.shallow_validation:
                            logger.warning(self._TAG, self.ctx, message, message_path)
                        else:
                            logger.error(self._TAG, self.ctx, message, message_path)
                        # don't check in this file without both of these comments. handy for debug of failed lookups
                        # res_test = obj.fetch_object_definition(res_opt)
                    else:
                        logger.info(self._TAG, self.ctx, 'resolved \'{}\''.format(obj.named_reference), current_doc.folder_path + path)

            return False

        def pos_callback(obj: 'CdmObject', path: str) -> bool:
            if obj.object_type == CdmObjectType.PARAMETER_DEF:
                # when a parameter has a datatype that is a cdm object, validate that any default value is the
                # right kind object
                self._const_type_check(res_opt, current_doc, obj, None)
            return False

        current_doc.visit('', pre_callback, pos_callback)
        res_opt._indexing_doc = None

    def _resolve_trait_arguments(self, res_opt: 'ResolveOptions', current_doc: 'CdmDocumentDefinition') -> None:
        ctx = self.ctx

        def pre_visit(obj: 'CdmObject', path: str) -> bool:
            if obj.object_type == CdmObjectType.TRAIT_REF:
                ctx.push_scope(obj.fetch_object_definition(res_opt))
            elif obj.object_type == CdmObjectType.ARGUMENT_DEF:
                try:
                    if ctx._current_scope._current_trait:
                        ctx._relative_path = path
                        params = ctx._current_scope._current_trait._fetch_all_parameters(res_opt)

                        param_found = params.resolve_parameter(
                            ctx._current_scope._current_parameter,
                            obj.get_name())

                        obj._resolved_parameter = param_found
                        a_value = obj.value

                        # if parameter type is entity, then the value should be an entity or ref to one
                        # same is true of 'dataType' dataType
                        a_value = self._const_type_check(res_opt, current_doc, param_found, a_value)
                        if a_value:
                            obj.value = a_value
                except Exception as e:
                    logger.error(self._TAG, self.ctx, e, path)
                    logger.error(self._TAG, self.ctx, 'failed to resolve parameter on trait \'{}\''.format(ctx._current_scope._current_trait.get_name()),
                                 current_doc.folder_path + path)

                ctx._current_scope._current_parameter += 1

            return False

        def post_visit(obj: 'CdmObject', path: str) -> bool:
            if obj.object_type == CdmObjectType.TRAIT_REF:
                obj._resolved_arguments = True
                ctx.pop_scope()

            return False

        current_doc.visit('', pre_visit, post_visit)

    def set_event_callback(self, status: 'EventCallback', report_at_level: 'CdmStatusLevel' = CdmStatusLevel.INFO, correlation_id: Optional[str] = None):
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
            return await self._fetch_last_modified_time_from_object_async(curr_object)
        return None

    async def _fetch_last_modified_time_from_object_async(self, curr_object: 'CdmObject') -> datetime:
        """Return last modified time of the file where the input object can be found."""
        if isinstance(curr_object, CdmContainerDefinition):
            adapter = self.storage.fetch_adapter(cast('CdmContainerDefinition', curr_object).namespace)
            if not adapter:
                logger.error(self._TAG, self.ctx, 'Adapter not found for the Cdm object by ID {}.'.format(
                    curr_object.id), self._fetch_last_modified_time_from_object_async.__name__)
                return None
            # Remove namespace from path
            path_tuple = StorageUtils.split_namespace_path(curr_object.at_corpus_path)
            if not path_tuple:
                logger.error(self._TAG, self.ctx, 'The object\'s AtCorpusPath should not be null or empty.',
                             self._fetch_last_modified_time_from_object_async.__name__)
                return None
            try:
                return await adapter.compute_last_modified_time_async(path_tuple[1])
            except Exception as e:
                logger.error(self._TAG, self.ctx, 'Failed to compute last modified time for file \'{}\'. Exception: {}'.format(path_tuple[1], e),
                             self._fetch_last_modified_time_from_object_async.__name__)
                return None
        else:
            return await self._fetch_last_modified_time_from_object_async(curr_object.in_document)

    async def _fetch_last_modified_time_from_partition_path_async(self, corpus_path: str) -> datetime:
        """Return last modified time of a partition object."""

        # We do not want to load partitions from file, just check the modified times.
        path_tuple = StorageUtils.split_namespace_path(corpus_path)
        if not path_tuple:
            logger.error(self._TAG, self.ctx, 'The object path cannot be null or empty.', self._fetch_last_modified_time_from_partition_path_async.__name__)
            return None
        namespace = path_tuple[0]
        if namespace:
            adapter = self.storage.fetch_adapter(namespace)
            if not adapter:
                logger.error(self._TAG, self.ctx, 'Adapter not found for the corpus path \'{}\''.format(
                    corpus_path), self._fetch_last_modified_time_from_partition_path_async.__name__)
                return None
            try:
                return await adapter.compute_last_modified_time_async(path_tuple[1])
            except Exception as e:
                logger.error(self._TAG, self.ctx, 'Failed to compute last modified time for file \'{}\'. Exception: {}'.format(path_tuple[1], e),
                             self._fetch_last_modified_time_from_partition_path_async.__name__)
        return None

    @staticmethod
    def _fetch_cache_key_from_object(definition: 'CdmObject', kind: str) -> str:
        return '{}-{}'.format(definition.id, kind)

    @staticmethod
    def _fetch_priority_doc(docs: List['CdmDocumentDefinition'], import_priority: Dict['CdmDocumentDefinition', 'ImportInfo']) -> 'CdmDocumentDefinition':
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
        if of_type in [CdmObjectType.ARGUMENT_DEF, CdmObjectType.DOCUMENT_DEF, CdmObjectType.MANIFEST_DEF, CdmObjectType.IMPORT, CdmObjectType.PARAMETER_DEF]:
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
        if of_type in [CdmObjectType.ENTITY_ATTRIBUTE_DEF, CdmObjectType.TYPE_ATTRIBUTE_DEF, CdmObjectType.ATTRIBUTE_REF]:
            return CdmObjectType.ATTRIBUTE_REF
        if of_type in [CdmObjectType.ATTRIBUTE_CONTEXT_DEF, CdmObjectType.ATTRIBUTE_CONTEXT_REF]:
            return CdmObjectType.ATTRIBUTE_CONTEXT_REF

        return CdmObjectType.ERROR

    async def fetch_object_async(self, object_path: str, relative_object: Optional['CdmObject'] = None, shallow_validation: Optional[bool] = False,
                                 force_reload: Optional[bool] = False, res_opt: Optional['ResolveOptions'] = None) -> Optional['CdmObject']:
        """gets an object by the path from the Corpus."""
        from cdm.persistence import PersistenceLayer

        with logger._enter_scope(self._TAG, self.ctx, self.fetch_object_async.__name__):

            if res_opt is None:
                res_opt = ResolveOptions()

            object_path = self.storage.create_absolute_corpus_path(object_path, relative_object)
            document_path = object_path
            document_name_index = object_path.rfind(PersistenceLayer.CDM_EXTENSION)

            if document_name_index != -1:
                # if there is something after the document path, split it into document path and object path.
                document_name_index += len(PersistenceLayer.CDM_EXTENSION)
                document_path = object_path[0: document_name_index]

            logger.debug(self._TAG, self.ctx, 'request object: {}'.format(object_path), self.fetch_object_async.__name__)
            obj = await self._load_folder_or_document(document_path, force_reload)

            if not obj:
                return None

            # get imports and index each document that is loaded
            if isinstance(obj, CdmDocumentDefinition):
                if res_opt.shallow_validation is None:
                    res_opt.shallow_validation = shallow_validation
                if not await obj._index_if_needed(res_opt, False):
                    return None
                if not obj._is_valid:
                    logger.error(self._TAG, self.ctx, 'The requested path: {} involves a document that failed validation'.format(
                        object_path), self.fetch_object_async.__name__)
                    return None

            if document_path == object_path:
                return obj

            if document_name_index == -1:
                # there is no remaining path to be loaded, so return.
                return None

            # trim off the document path to get the object path in the doc
            remaining_object_path = object_path[document_name_index + 1:]

            result = obj._fetch_object_from_document_path(remaining_object_path, res_opt)
            if not result:
                logger.error(self._TAG, self.ctx, 'Could not find symbol "{}" in document [{}]'.format(
                    remaining_object_path, obj.at_corpus_path), self.fetch_object_async.__name__)

            return result

    def _is_path_manifest_document(self, path: str) -> bool:
        from cdm.persistence import PersistenceLayer

        return path.endswith(PersistenceLayer.FOLIO_EXTENSION) or path.endswith(PersistenceLayer.MANIFEST_EXTENSION) \
            or path.endswith(PersistenceLayer.MODEL_JSON_EXTENSION)

    def fetch_incoming_relationships(self, path: str) -> List['E2ERelationshipDef']:
        return self._incoming_relationships.get(path, [])

    def fetch_outgoing_relationships(self, path: str) -> List['E2ERelationshipDef']:
        return self._outgoing_relationships.get(path, [])

    def _get_from_attributes(self, new_gen_set: 'CdmAttributeContext', from_attrs: List['CdmAttributeReference']) -> List['CdmAttributeReference']:
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

    def _get_to_attributes(self, from_attr_def: 'CdmTypeAttributeDefinition', res_opt: 'ResolveOptions') -> List[Tuple[str, str, str]]:
        """For Projections get the list of 'To' Attributes"""
        if from_attr_def and from_attr_def.applied_traits:
            tuple_list = []
            for trait in from_attr_def.applied_traits:
                if trait.named_reference == 'is.linkedEntity.identifier' and len(trait.arguments) > 0:
                    const_ent = trait.arguments[0].value.fetch_object_definition(res_opt)
                    if const_ent and const_ent.constant_values:
                        for constant_values in const_ent.constant_values:
                            tuple_list.append((constant_values[0], constant_values[1], constant_values[2] if len(constant_values) > 2 else ''))
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
                ent_art = await self.fetch_object_async('cdm:/primitives.cdm.json/defaultArtifacts')  # type: CdmEntityDefinition
            finally:
                self.set_event_callback(old_status, old_level)

            if not ent_art:
                # fallback to the old ways, just make some
                art_att = self.make_object(CdmObjectType.TYPE_ATTRIBUTE_DEF, 'count')  # type: CdmTypeAttributeDefinition
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
                    self._known_artifact_attributes[cast(CdmAttribute, att).name] = cast(CdmTypeAttributeDefinition, att)

        return True

    def _fetch_artifact_attribute(self, name: str) -> 'CdmTypeAttributeDefinition':
        """
        Returns the (previously prepared) artifact attribute of the known name
        """
        if not self._known_artifact_attributes:
            return None  # this is a usage mistake. never call this before success from the _prepare_artifact_attributes_async

        return cast('CdmTypeAttributeDefinition', self._known_artifact_attributes[name].copy())

