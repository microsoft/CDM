# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional, Dict, List

from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmCorpusContext, CdmCorpusDefinition, CdmEntityReference
from cdm.resolvedmodel import ResolvedAttributeSet
from cdm.resolvedmodel.projections.projection_attribute_state import ProjectionAttributeState
from cdm.resolvedmodel.projections.projection_attribute_state_set import ProjectionAttributeStateSet
from cdm.resolvedmodel.projections.projection_context import ProjectionContext
from cdm.resolvedmodel.projections.projection_directive import ProjectionDirective
from cdm.resolvedmodel.projections.search_result import SearchResult
from cdm.resolvedmodel.projections.search_structure import SearchStructure
from cdm.utilities import AttributeContextParameters


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
        attr_ctx_param: 'AttributeContextParameters'
    ) -> Dict[str, 'ProjectionAttributeState']:
        """If a source is tagged as polymorphic source, get the list of original source"""
        poly_sources = {}

        # TODO (sukanyas): when projection based polymorphic source is made available - the following line will have to be changed
        # for now assuming non-projections based polymorphic source
        source_def = source.fetch_object_definition(proj_dir._res_opt)
        for attr in source_def.attributes:
            if attr.object_type == CdmObjectType.ENTITY_ATTRIBUTE_DEF:
                ra_set = attr._fetch_resolved_attributes(proj_dir._res_opt, None)
                for res_attr in ra_set._set:
                    proj_attr_state = ProjectionAttributeState(ctx)
                    proj_attr_state._current_resolved_attribute = res_attr
                    proj_attr_state._previous_state_list = None

                    # the key already exists, just add to the existing list
                    if res_attr.resolved_name in poly_sources:
                        existing_set = poly_sources[res_attr.resolved_name]
                        existing_set.append(proj_attr_state)
                        poly_sources[res_attr.resolved_name] = existing_set
                    else:
                        pas_list = []
                        pas_list.append(proj_attr_state)
                        poly_sources[res_attr.resolved_name] = pas_list

        return poly_sources

    @staticmethod
    def _get_leaf_list(proj_ctx: 'ProjectionContext', attr_name: str) -> List['ProjectionAttributeState']:
        """Get leaf nodes of the projection state tree for polymorphic scenarios"""
        result = None

        for top in proj_ctx._current_attribute_state_set._values:
            st = SearchStructure()
            st = SearchStructure._build_structure(top, top, attr_name, st, False, 0)
            if st and st._result.found_flag == True and len(st._result.leaf) > 0:
                result = st._result

        return result.leaf if result else None

    @staticmethod
    def _get_top(proj_ctx: 'ProjectionContext', attr_name: str) -> List['ProjectionAttributeState']:
        """Get top node of the projection state tree for non-polymorphic scenarios"""
        result = SearchResult()
        for top in proj_ctx._current_attribute_state_set._values:
            st = SearchStructure()
            st = SearchStructure._build_structure(top, top, attr_name, st, False, 0)
            if st and st._result.found_flag == True:
                result = st._result

        return result.top if result else None

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

            if (res_attr and res_attr.target and res_attr.target.owner and
                (res_attr.target.object_type == CdmObjectType.TYPE_ATTRIBUTE_DEF or res_attr.target.object_type == CdmObjectType.ENTITY_ATTRIBUTE_DEF)):
                owner = res_attr.target.owner

                while owner and owner.object_type != CdmObjectType.ENTITY_DEF:
                    owner = owner.owner

                if owner and owner.object_type == CdmObjectType.ENTITY_DEF:
                    ent_def = owner.fetch_object_definition(proj_dir._res_opt)
                    if ent_def:
                        # should contain relative path without the namespace
                        relative_ent_path = ent_def.ctx.corpus.storage.create_relative_corpus_path(ent_def.at_corpus_path, ent_def.in_document)
                        ent_ref_and_attr_name_list.append([relative_ent_path, res_attr.resolved_name])

        if len(ent_ref_and_attr_name_list) > 0:
            constant_entity = corpus.make_object(CdmObjectType.CONSTANT_ENTITY_DEF)
            constant_entity.entity_shape = corpus.make_ref(CdmObjectType.ENTITY_REF, 'entityGroupSet', True)

            constant_values = []
            for ent_and_attr_name in ent_ref_and_attr_name_list:
                original_source_entity_attribute_name = proj_dir._original_source_entity_attribute_name or ''
                constant_values.append([
                    ent_and_attr_name[0],
                    ent_and_attr_name[1],
                    '{}_{}'.format(original_source_entity_attribute_name, ent_and_attr_name[0][ent_and_attr_name[0].rindex('/') + 1:])
                ])

            constant_entity.constant_values = constant_values

            trait_param_ent_ref = corpus.make_ref(CdmObjectType.ENTITY_REF, constant_entity, False)

        return trait_param_ent_ref
