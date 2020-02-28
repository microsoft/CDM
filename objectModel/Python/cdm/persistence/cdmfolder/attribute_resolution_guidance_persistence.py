# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional

from cdm.enums import CdmObjectType
from cdm.persistence import PersistenceLayer
from cdm.objectmodel import CdmAttributeResolutionGuidanceDefinition, CdmAttributeResolutionGuidance_EntityByReference, \
    CdmAttributeResolutionGuidance_Expansion, CdmAttributeResolutionGuidance_SelectsSubAttribute, CdmCorpusContext
from cdm.utilities import ResolveOptions, CopyOptions

from . import utils
from .types import AttributeResolutionGuidance
from .types.attribute_resolution_guidance import EntityByReference, Expansion, SelectsSubAttribute


class AttributeResolutionGuidancePersistence:
    @staticmethod
    def from_data(ctx: CdmCorpusContext, data: AttributeResolutionGuidance) -> CdmAttributeResolutionGuidanceDefinition:
        """Creates an instance of attribute resolution guidance from data object."""

        if not data:
            return None

        attribute_resolution = ctx.corpus.make_object(CdmObjectType.ATTRIBUTE_RESOLUTION_GUIDANCE_DEF)

        attribute_resolution.remove_attribute = data.get('removeAttribute')
        attribute_resolution.imposed_directives = data.get('imposedDirectives')
        attribute_resolution.removed_directives = data.get('removedDirectives')
        attribute_resolution.cardinality = data.get('cardinality')
        attribute_resolution.rename_format = data.get('renameFormat')

        if data.get('addSupportingAttribute') is not None:
            attribute_resolution.add_supporting_attribute = utils.create_attribute(ctx, data.addSupportingAttribute)

        if data.get('expansion') is not None:
            attribute_resolution.expansion = CdmAttributeResolutionGuidance_Expansion()
            attribute_resolution.expansion.starting_ordinal = data.expansion.get('startingOrdinal')
            attribute_resolution.expansion.maximum_expansion = data.expansion.get('maximumExpansion')

            if data.expansion.get('countAttribute'):
                attribute_resolution.expansion.count_attribute = utils.create_attribute(ctx, data.expansion.countAttribute)

        if data.get('entityByReference') is not None:
            attribute_resolution.entity_by_reference = CdmAttributeResolutionGuidance_EntityByReference()
            attribute_resolution.entity_by_reference.allow_reference = data.entityByReference.get('allowReference')
            attribute_resolution.entity_by_reference.always_include_foreign_key = data.entityByReference.get('alwaysIncludeForeignKey')
            attribute_resolution.entity_by_reference.reference_only_after_depth = data.entityByReference.get('referenceOnlyAfterDepth')

            if data.entityByReference.get('foreignKeyAttribute'):
                attribute_resolution.entity_by_reference.foreign_key_attribute = utils.create_attribute(ctx, data.entityByReference.foreignKeyAttribute)

        if data.get('selectsSubAttribute') is not None:
            attribute_resolution.selects_sub_attribute = CdmAttributeResolutionGuidance_SelectsSubAttribute()
            attribute_resolution.selects_sub_attribute.selects = data.selectsSubAttribute.get('selects')

            if data.selectsSubAttribute.get('selectedTypeAttribute'):
                attribute_resolution.selects_sub_attribute.selected_type_attribute = utils.create_attribute(
                    ctx, data.selectsSubAttribute.selectedTypeAttribute)
            if data.selectsSubAttribute.get('selectsSomeTakeNames'):
                attribute_resolution.selects_sub_attribute.selects_some_take_names = data.selectsSubAttribute.selectsSomeTakeNames
            if data.selectsSubAttribute.get('selectsSomeAvoidNames'):
                attribute_resolution.selects_sub_attribute.selects_some_avoid_names = data.selectsSubAttribute.selectsSomeAvoidNames

        return attribute_resolution

    @staticmethod
    def to_data(instance: CdmAttributeResolutionGuidanceDefinition, res_opt: ResolveOptions, options: CopyOptions) -> Optional[AttributeResolutionGuidance]:
        if not instance:
            return None

        result = AttributeResolutionGuidance()
        result.removeAttribute = instance.remove_attribute
        result.imposedDirectives = instance.imposed_directives
        result.removedDirectives = instance.removed_directives
        result.cardinality = instance.cardinality
        result.renameFormat = instance.rename_format

        if instance.add_supporting_attribute:
            result.addSupportingAttribute = PersistenceLayer.to_data(instance.add_supporting_attribute, res_opt, options, PersistenceLayer.CDM_FOLDER)

        if instance.expansion:
            result.expansion = Expansion()
            result.expansion.startingOrdinal = instance.expansion.starting_ordinal
            result.expansion.maximumExpansion = instance.expansion.maximum_expansion

            if instance.expansion.count_attribute:
                result.expansion.countAttribute = PersistenceLayer.to_data(instance.expansion.count_attribute, res_opt, options, PersistenceLayer.CDM_FOLDER)

        if instance.entity_by_reference:
            result.entityByReference = EntityByReference()
            result.entityByReference.allowReference = instance.entity_by_reference.allow_reference
            result.entityByReference.alwaysIncludeForeignKey = instance.entity_by_reference.always_include_foreign_key
            result.entityByReference.referenceOnlyAfterDepth = instance.entity_by_reference.reference_only_after_depth

            if instance.entity_by_reference.foreign_key_attribute:
                result.entityByReference.foreignKeyAttribute = PersistenceLayer.to_data(
                    instance.entity_by_reference.foreign_key_attribute, res_opt, options, PersistenceLayer.CDM_FOLDER)

        if instance.selects_sub_attribute:
            result.selectsSubAttribute = SelectsSubAttribute()
            result.selectsSubAttribute.selects = instance.selects_sub_attribute.selects
            if instance.selects_sub_attribute.selected_type_attribute:
                result.selectsSubAttribute.selectedTypeAttribute = PersistenceLayer.to_data(
                    instance.selects_sub_attribute.selected_type_attribute, res_opt, options, PersistenceLayer.CDM_FOLDER)
                result.selectsSubAttribute.selectsSomeTakeNames = instance.selects_sub_attribute.selects_some_take_names
                result.selectsSubAttribute.selectsSomeAvoidNames = instance.selects_sub_attribute.selects_some_avoid_names

        return result
