from typing import Optional

from cdm.enums import CdmObjectType
from cdm.persistence import persistence_layer
from cdm.objectmodel import CdmAttributeResolutionGuidanceDefinition, CdmAttributeResolutionGuidance_EntityByReference, \
    CdmAttributeResolutionGuidance_Expansion, CdmAttributeResolutionGuidance_SelectsSubAttribute, CdmCorpusContext
from cdm.utilities import ResolveOptions, CopyOptions

from . import utils
from .types import AttributeResolutionGuidance
from .types.attribute_resolution_guidance import EntityByReference, Expansion, SelectsSubAttribute


class AttributeResolutionGuidancePersistence:
    @staticmethod
    def from_data(ctx: CdmCorpusContext, dataObj: AttributeResolutionGuidance) -> CdmAttributeResolutionGuidanceDefinition:
        """Creates an instance of attribute resolution guidance from data object."""

        if not dataObj:
            return None

        new_ref = ctx.corpus.make_object(CdmObjectType.ATTRIBUTE_RESOLUTION_GUIDANCE_DEF)

        new_ref.remove_attribute = dataObj.get('removeAttribute')
        new_ref.imposed_directives = dataObj.get('imposedDirectives')
        new_ref.removed_directives = dataObj.get('removedDirectives')
        new_ref.cardinality = dataObj.get('cardinality')
        new_ref.rename_format = dataObj.get('renameFormat')

        if dataObj.get('addSupportingAttribute'):
            new_ref.add_supporting_attribute = utils.create_attribute(ctx, dataObj.addSupportingAttribute)

        if dataObj.get('expansion'):
            new_ref.expansion = CdmAttributeResolutionGuidance_Expansion()
            new_ref.expansion.starting_ordinal = dataObj.expansion.get('startingOrdinal')
            new_ref.expansion.maximum_expansion = dataObj.expansion.get('maximumExpansion')

            if dataObj.expansion.get('countAttribute'):
                new_ref.expansion.count_attribute = utils.create_attribute(ctx, dataObj.expansion.countAttribute)

        if dataObj.get('entityByReference'):
            new_ref.entity_by_reference = CdmAttributeResolutionGuidance_EntityByReference()
            new_ref.entity_by_reference.allow_reference = dataObj.entityByReference.get('allowReference')
            new_ref.entity_by_reference.always_include_foreign_key = dataObj.entityByReference.get('alwaysIncludeForeignKey')
            new_ref.entity_by_reference.reference_only_after_depth = dataObj.entityByReference.get('referenceOnlyAfterDepth')

            if dataObj.entityByReference.get('foreignKeyAttribute'):
                new_ref.entity_by_reference.foreign_key_attribute = utils.create_attribute(ctx, dataObj.entityByReference.foreignKeyAttribute)

        if dataObj.get('selectsSubAttribute'):
            new_ref.selects_sub_attribute = CdmAttributeResolutionGuidance_SelectsSubAttribute()
            new_ref.selects_sub_attribute.selects = dataObj.selectsSubAttribute.get('selects')

            if dataObj.selectsSubAttribute.get('selectedTypeAttribute'):
                new_ref.selects_sub_attribute.selected_type_attribute = utils.create_attribute(ctx, dataObj.selectsSubAttribute.selectedTypeAttribute)

        return new_ref

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
            result.addSupportingAttribute = persistence_layer.to_data(instance.add_supporting_attribute, res_opt, 'CdmFolder', options)

        if instance.expansion:
            result.expansion = Expansion()
            result.expansion.startingOrdinal = instance.expansion.starting_ordinal
            result.expansion.maximumExpansion = instance.expansion.maximum_expansion

            if instance.expansion.count_attribute:
                result.expansion.countAttribute = persistence_layer.to_data(instance.expansion.count_attribute, res_opt, 'CdmFolder', options)

        if instance.entity_by_reference:
            result.entityByReference = EntityByReference()
            result.entityByReference.allowReference = instance.entity_by_reference.allow_reference
            result.entityByReference.alwaysIncludeForeignKey = instance.entity_by_reference.always_include_foreign_key
            result.entityByReference.referenceOnlyAfterDepth = instance.entity_by_reference.reference_only_after_depth

            if instance.entity_by_reference.foreign_key_attribute:
                result.entityByReference.foreignKeyAttribute = persistence_layer.to_data(
                    instance.entity_by_reference.foreign_key_attribute, res_opt, 'CdmFolder', options)

        if instance.selects_sub_attribute:
            result.selectsSubAttribute = SelectsSubAttribute()
            result.selectsSubAttribute.selects = instance.selects_sub_attribute.selects
            if instance.selects_sub_attribute.selected_type_attribute:
                result.selectsSubAttribute.selectedTypeAttribute = persistence_layer.to_data(
                    instance.selects_sub_attribute.selected_type_attribute, res_opt, 'CdmFolder', options)

        return result
