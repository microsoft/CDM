# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from collections import OrderedDict
from typing import Optional, Dict, List

from cdm.enums import CdmAttributeContextType, CdmLogCode, CdmObjectType
from cdm.objectmodel import CdmAttributeContext, CdmCorpusContext, CdmCorpusDefinition, CdmEntityReference, CdmEntityDefinition, CdmObject
from cdm.resolvedmodel import ResolvedAttributeSet
from cdm.resolvedmodel.projections.projection_attribute_state import ProjectionAttributeState
from cdm.resolvedmodel.projections.projection_attribute_state_set import ProjectionAttributeStateSet
from cdm.resolvedmodel.projections.projection_context import ProjectionContext
from cdm.resolvedmodel.projections.projection_directive import ProjectionDirective
from cdm.resolvedmodel.projections.search_structure import SearchStructure
from cdm.utilities import AttributeContextParameters, logger

TAG = 'ProjectionResolutionCommonUtil'


class ProjectionResolutionCommonUtil:
    """A utility class to handle name based functionality for projections and operations"""

    @staticmethod
    def _initialize_projection_attribute_state_set(
        proj_dir: 'ProjectionDirective',
        ctx: 'CdmCorpusContext',
        org_src_RAS: 'ResolvedAttributeSet',
        is_source_polymorphic: Optional[bool] = False,
        polymorphic_set: Optional[Dict[str, 'ProjectionAttributeState']] = None
    ) -> 'ProjectionAttributeStateSet':
        """Function to initialize the input projection attribute state Set for a projection"""
        set = ProjectionAttributeStateSet(ctx)

        for res_attr in org_src_RAS._set:
            prev_set = None
            if is_source_polymorphic and polymorphic_set is not None:
                poly_list = None
                if res_attr.resolved_name in polymorphic_set:
                    poly_list = polymorphic_set[res_attr.resolved_name]
                prev_set = poly_list

            proj_attr_state = ProjectionAttributeState(ctx)
            proj_attr_state._current_resolved_attribute = res_attr
            proj_attr_state._previous_state_list = prev_set
            set._add(proj_attr_state)

        return set

    @staticmethod
    def _get_polymorphic_source_set(
        proj_dir: 'ProjectionDirective',
        ctx: 'CdmCorpusContext',
        source: 'CdmEntityReference',
        ras_source: 'ResolvedAttributeSet'
    ) -> Dict[str, 'ProjectionAttributeState']:
        """If a source is tagged as polymorphic source, get the list of original source"""
        poly_sources = {}

        # TODO (sukanyas): when projection based polymorphic source is made available - the following line will have to be changed
        # for now assuming non-projections based polymorphic source
        source_def = source.fetch_object_definition(proj_dir._res_opt)  # type: CdmEntityDefinition
        for attr in source_def.attributes:
            if attr.object_type == CdmObjectType.ENTITY_ATTRIBUTE_DEF:
                # the attribute context for this entity typed attribute was already created by the `FetchResolvedAttributes` that happens before this function call.
                # we are only interested in linking the attributes to the entity that they came from and the attribute context nodes should not be taken into account.
                # create this dummy attribute context so the resolution code works properly and discard it after.
                attr_ctx_param = AttributeContextParameters  # type: AttributeContextParameters
                attr_ctx_param._regarding = attr
                attr_ctx_param._type = CdmAttributeContextType.PASS_THROUGH
                attr_ctx_param._under = CdmAttributeContext(ctx, 'discard')

                ra_set = attr._fetch_resolved_attributes(proj_dir._res_opt, attr_ctx_param)
                for res_attr in ra_set._set:
                    # we got a null ctx because null was passed in to fetch, but the nodes are in the parent's tree
                    # so steal them based on name
                    res_att_src = ras_source.get(res_attr.resolved_name)
                    if res_att_src:
                        res_attr.att_ctx = res_att_src.att_ctx
                    proj_attr_state = ProjectionAttributeState(ctx)
                    proj_attr_state._current_resolved_attribute = res_attr
                    proj_attr_state._previous_state_list = None

                    # the key doesn't exist, initialize with an empty list first
                    if res_attr.resolved_name not in poly_sources:
                        poly_sources[res_attr.resolved_name] = []
                    poly_sources[res_attr.resolved_name].append(proj_attr_state)

        return poly_sources

    @staticmethod
    def _get_leaf_list(proj_ctx: 'ProjectionContext', attr_name: str) -> List['ProjectionAttributeState']:
        """Get leaf nodes of the projection state tree for polymorphic scenarios"""
        result = None

        for top in proj_ctx._current_attribute_state_set._states:
            st = SearchStructure()
            st = SearchStructure._build_structure(top, top, attr_name, st, False, 0)
            if st and st._result.found_flag == True and len(st._result.leaf) > 0:
                result = st._result

        return result.leaf if result else None

    @staticmethod
    def _get_top_list(proj_ctx: 'ProjectionContext', attr_names: List[str]) -> Dict[str, str]:
        """Gets the names of the top-level nodes in the projection state tree (for non-polymorphic scenarios) that match a set of attribute names """
        # This dictionary contains a mapping from the top-level name of an attribute
        # to the attribute name the top-level name was derived from (the name contained in the given list)
        top_level_attribute_names = OrderedDict()

        # Iterate through each attribute name in the list and search for their top-level names
        for attr_name in attr_names:
            # Iterate through each projection attribute state in the current set and check if its
            # current resolved attribute's name is the top-level name of the current attrName
            for top in proj_ctx._current_attribute_state_set._states:
                st = SearchStructure()
                st = SearchStructure._build_structure(top, top, attr_name, st, False, 0)
                # Found the top-level name
                if st and st._result.found_flag:
                    # Create a mapping from the top-level name of the attribute to the name it has in the list
                    top_level_attribute_names[top._current_resolved_attribute.resolved_name] = attr_name

        return top_level_attribute_names

    @staticmethod
    def _convert_to_list(top: 'ProjectionAttributeState') -> List['ProjectionAttributeState']:
        """Convert a single value to a list"""
        top_list = None
        if top:
            top_list = []
            top_list.append(top)
        return top_list

    @staticmethod
    def _create_foreign_key_linked_entity_identifier_trait_parameter(
            proj_dir: 'ProjectionDirective',
            corpus: 'CdmCorpusDefinition',
            ref_found_list: List['ProjectionAttributeState']
    ) -> 'CdmEntityReference':
        """
        Create a constant entity that contains the source mapping to a foreign key.
        e.g.
        an fk created to entity "Customer" based on the "customerName", would add a parameter to the "is.linkedEntity.identifier" trait as follows:
          [
            "/Customer.cdm.json/Customer",
            "customerName"
          ]
        In the case of polymorphic source, there will be a collection of such entries.
        """
        trait_param_ent_ref = None

        ent_ref_and_attr_name_list = []

        for ref_found in ref_found_list:
            res_attr = ref_found._current_resolved_attribute

            if not res_attr.owner:
                at_corpus_path = res_attr.target.at_corpus_path if isinstance(res_attr.target, CdmObject) else res_attr.resolved_name
                logger.warning(corpus.ctx, TAG, '_create_foreign_key_linked_entity_identifier_trait_parameter', at_corpus_path, \
                    CdmLogCode.WARN_PROJ_CREATE_FOREIGN_KEY_TRAITS, res_attr.resolved_name)
            elif res_attr.target.object_type == CdmObjectType.TYPE_ATTRIBUTE_DEF or res_attr.target.object_type == CdmObjectType.ENTITY_ATTRIBUTE_DEF:
                # find the linked entity
                owner = res_attr.owner
                
                # find where the projection is defined
                projection_doc = proj_dir._owner.in_document if proj_dir._owner else None

                if owner and owner.object_type == CdmObjectType.ENTITY_DEF and projection_doc:
                    ent_def = owner.fetch_object_definition(proj_dir._res_opt)
                    if ent_def:
                        # should contain relative path without the namespace
                        relative_ent_path = ent_def.ctx.corpus.storage.create_relative_corpus_path(ent_def.at_corpus_path, projection_doc)
                        ent_ref_and_attr_name_list.append([relative_ent_path, res_attr.resolved_name])

        if len(ent_ref_and_attr_name_list) > 0:
            constant_entity = corpus.make_object(CdmObjectType.CONSTANT_ENTITY_DEF)
            constant_entity.entity_shape = corpus.make_ref(CdmObjectType.ENTITY_REF, 'entitySet', True)

            constant_values = []
            for ent_and_attr_name in ent_ref_and_attr_name_list:
                original_source_entity_attribute_name = proj_dir._original_source_attribute_name or ''
                constant_values.append([
                    ent_and_attr_name[0],
                    ent_and_attr_name[1],
                    '{}_{}'.format(original_source_entity_attribute_name, ent_and_attr_name[0][ent_and_attr_name[0].rindex('/') + 1:])
                ])

            constant_entity.constant_values = constant_values

            trait_param_ent_ref = corpus.make_ref(CdmObjectType.ENTITY_REF, constant_entity, False)

        return trait_param_ent_ref
