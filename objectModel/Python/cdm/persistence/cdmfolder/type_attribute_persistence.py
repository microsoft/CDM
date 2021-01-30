# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional

from cdm.objectmodel import CdmCorpusContext, CdmTypeAttributeDefinition
from cdm.objectmodel.projections.cardinality_settings import CardinalitySettings
from cdm.enums import CdmDataFormat, CdmObjectType
from cdm.utilities import logger, ResolveOptions, CopyOptions, TraitToPropertyMap, copy_data_utils

from . import utils
from .attribute_context_reference_persistence import AttributeContextReferencePersistence
from .attribute_resolution_guidance_persistence import AttributeResolutionGuidancePersistence
from .data_type_reference_persistence import DataTypeReferencePersistence
from .projections.projection_persistence import ProjectionPersistence
from .purpose_reference_persistence import PurposeReferencePersistence
from .types import TypeAttribute

_TAG = 'TypeAttributePersistence'


class TypeAttributePersistence:
    @staticmethod
    def from_data(ctx: CdmCorpusContext, data: TypeAttribute, entity_name: Optional[str] = None) -> CdmTypeAttributeDefinition:
        type_attribute = ctx.corpus.make_object(CdmObjectType.TYPE_ATTRIBUTE_DEF, data.get('name'))
        type_attribute.purpose = PurposeReferencePersistence.from_data(ctx, data.get('purpose'))
        type_attribute.data_type = DataTypeReferencePersistence.from_data(ctx, data.get('dataType'))

        if data.get('cardinality'):
            min_cardinality = None
            if data.get('cardinality').get('minimum'):
                min_cardinality = data.get('cardinality').get('minimum')

            max_cardinality = None
            if data.get('cardinality').get('maximum'):
                max_cardinality = data.get('cardinality').get('maximum')

            if not min_cardinality or not max_cardinality:
                logger.error(_TAG, ctx, 'Both minimum and maximum are required for the Cardinality property.')

            if not CardinalitySettings._is_minimum_valid(min_cardinality):
                logger.error(_TAG, ctx, 'Invalid minimum cardinality {}.'.format(min_cardinality))

            if not CardinalitySettings._is_maximum_valid(max_cardinality):
                logger.error(_TAG, ctx, 'Invalid maximum cardinality {}.'.format(max_cardinality))

            if min_cardinality and max_cardinality and CardinalitySettings._is_minimum_valid(min_cardinality) and CardinalitySettings._is_maximum_valid(max_cardinality):
                type_attribute.cardinality = CardinalitySettings(type_attribute)
                type_attribute.cardinality.minimum = min_cardinality
                type_attribute.cardinality.maximum = max_cardinality

        type_attribute.attribute_context = AttributeContextReferencePersistence.from_data(ctx, data.get('attributeContext'))
        type_attribute.resolution_guidance = AttributeResolutionGuidancePersistence.from_data(ctx, data.get('resolutionGuidance'))

        applied_traits = utils.create_trait_reference_array(ctx, data.get('appliedTraits'))
        type_attribute.applied_traits.extend(applied_traits)

        if data.get('isPrimaryKey') and entity_name:
            t2p_map = TraitToPropertyMap(type_attribute)
            t2p_map._update_property_value('isPrimaryKey', entity_name + '/(resolvedAttributes)/' + type_attribute.name)
        
        type_attribute.explanation = data.explanation
        type_attribute.is_read_only = utils._property_from_data_to_bool(data.isReadOnly)
        type_attribute.is_nullable = utils._property_from_data_to_bool(data.isNullable)
        type_attribute.source_name = utils._property_from_data_to_string(data.sourceName)
        type_attribute.source_ordering = utils._property_from_data_to_int(data.sourceOrdering)
        type_attribute.display_name = utils._property_from_data_to_string(data.displayName)
        type_attribute.description = utils._property_from_data_to_string(data.description)
        type_attribute.value_constrained_to_list = utils._property_from_data_to_bool(data.valueConstrainedToList)
        type_attribute.maximum_length = utils._property_from_data_to_int(data.maximumLength)
        type_attribute.maximum_value = utils._property_from_data_to_string(data.maximumValue)
        type_attribute.minimum_value = utils._property_from_data_to_string(data.minimumValue)
        type_attribute.default_value = data.defaultValue
        type_attribute.projection = ProjectionPersistence.from_data(ctx, data.projection)

        if data.get('dataFormat') is not None:
            try:
                type_attribute.data_format = TypeAttributePersistence._data_type_from_data(data.dataFormat)
            except ValueError:
                logger.warning(TypeAttributePersistence.__name__, ctx, 'Couldn\'t find an enum value for {}.'.format(
                    data.dataFormat), TypeAttributePersistence.from_data.__name__)

        return type_attribute

    @staticmethod
    def to_data(instance: CdmTypeAttributeDefinition, res_opt: ResolveOptions, options: CopyOptions) -> TypeAttribute:
        if instance is None:
            return None

        applied_traits = \
            [trait for trait in instance.applied_traits if not trait.is_from_property] \
            if instance.applied_traits else None

        data = TypeAttribute()
        data.explanation = instance.explanation
        data.purpose = PurposeReferencePersistence.to_data(instance.purpose, res_opt, options) if instance.purpose else None
        data.dataType = DataTypeReferencePersistence.to_data(instance.data_type, res_opt, options) if instance.data_type else None
        data.name = instance.name
        data.appliedTraits = copy_data_utils._array_copy_data(res_opt, applied_traits, options)
        data.resolutionGuidance = AttributeResolutionGuidancePersistence.to_data(
            instance.resolution_guidance, res_opt, options) if instance.resolution_guidance else None
        data.projection = ProjectionPersistence.to_data(instance.projection, res_opt, options)
        data.attributeContext = AttributeContextReferencePersistence.to_data(
            instance.attribute_context, res_opt, options) if instance.attribute_context else None

        is_read_only = instance._get_property('isReadOnly')
        if is_read_only:
            data.isReadOnly = is_read_only

        is_nullable = instance._get_property('isNullable')
        if is_nullable:
            data.isNullable = is_nullable

        data.sourceName = instance._get_property('sourceName')

        source_ordering = instance._get_property('sourceOrdering')
        if source_ordering:
            data.sourceOrdering = source_ordering

        data.displayName = instance._get_property('displayName')
        data.description = instance._get_property('description')

        value_constrained_to_list = instance._get_property('valueConstrainedToList')
        if value_constrained_to_list:
            data.valueConstrainedToList = value_constrained_to_list

        is_primary_key = instance._get_property('isPrimaryKey')
        if is_primary_key:
            data.isPrimaryKey = is_primary_key

        data.maximumLength = instance._get_property('maximumLength')
        data.maximumValue = instance._get_property('maximumValue')
        data.minimumValue = instance._get_property('minimumValue')

        data_format = instance._get_property('dataFormat')
        if data_format != CdmDataFormat.UNKNOWN:
            data.dataFormat = data_format.value

        default_value = instance._get_property('defaultValue')
        if default_value:
            data.defaultValue = default_value

        return data

    @staticmethod
    def _data_type_from_data(data_type: str) -> CdmDataFormat:
        data_type = data_type.lower()
        if data_type == 'string':
            return CdmDataFormat.STRING
        elif data_type == 'char':
            return CdmDataFormat.CHAR
        elif data_type == 'int16':
            return CdmDataFormat.INT16
        elif data_type == 'int32':
            return CdmDataFormat.INT32
        elif data_type == 'int64':
            return CdmDataFormat.INT64
        elif data_type == 'float':
            return CdmDataFormat.FLOAT
        elif data_type == 'double':
            return CdmDataFormat.DOUBLE
        elif data_type == 'time':
            return CdmDataFormat.TIME
        elif data_type == 'date':
            return CdmDataFormat.DATE
        elif data_type == 'datetime':
            return CdmDataFormat.DATE_TIME
        elif data_type == 'datetimeoffset':
            return CdmDataFormat.DATE_TIME_OFFSET
        elif data_type == 'decimal':
            return CdmDataFormat.DECIMAL
        elif data_type == 'boolean':
            return CdmDataFormat.BOOLEAN
        elif data_type == 'byte':
            return CdmDataFormat.BYTE
        elif data_type == 'binary':
            return CdmDataFormat.BINARY
        elif data_type == 'guid':
            return CdmDataFormat.GUID
        elif data_type == 'json':
            return CdmDataFormat.JSON
        else:
            return CdmDataFormat.UNKNOWN
