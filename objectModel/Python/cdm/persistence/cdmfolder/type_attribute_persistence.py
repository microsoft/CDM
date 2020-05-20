# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional

from cdm.objectmodel import CdmCorpusContext, CdmTypeAttributeDefinition
from cdm.enums import CdmDataFormat, CdmObjectType
from cdm.utilities import logger, ResolveOptions, CopyOptions, TraitToPropertyMap, copy_data_utils

from . import utils
from .attribute_context_reference_persistence import AttributeContextReferencePersistence
from .attribute_resolution_guidance_persistence import AttributeResolutionGuidancePersistence
from .data_type_reference_persistence import DataTypeReferencePersistence
from .purpose_reference_persistence import PurposeReferencePersistence
from .types import TypeAttribute


class TypeAttributePersistence:
    @staticmethod
    def from_data(ctx: CdmCorpusContext, data: TypeAttribute, entity_name: Optional[str] = None) -> CdmTypeAttributeDefinition:
        type_attribute = ctx.corpus.make_object(CdmObjectType.TYPE_ATTRIBUTE_DEF, data.get('name'))
        type_attribute.purpose = PurposeReferencePersistence.from_data(ctx, data.get('purpose'))
        type_attribute.data_type = DataTypeReferencePersistence.from_data(ctx, data.get('dataType'))
        type_attribute.attribute_context = AttributeContextReferencePersistence.from_data(ctx, data.get('attributeContext'))
        type_attribute.resolution_guidance = AttributeResolutionGuidancePersistence.from_data(ctx, data.get('resolutionGuidance'))

        applied_traits = utils.create_trait_reference_array(ctx, data.get('appliedTraits'))
        type_attribute.applied_traits.extend(applied_traits)

        if data.get('isPrimaryKey') and entity_name:
            t2p_map = TraitToPropertyMap(type_attribute)
            t2p_map._update_property_value('isPrimaryKey', entity_name + '/(resolvedAttributes)/' + type_attribute.name)
        
        type_attribute.explanation = data.get('explanation')

        if data.get('isReadOnly') is not None:
            type_attribute.is_read_only = TypeAttributePersistence._property_from_data_to_bool(data.isReadOnly)

        if data.get('isNullable') is not None:
            type_attribute.is_nullable = TypeAttributePersistence._property_from_data_to_bool(data.isNullable)

        if data.get('sourceName'):
            type_attribute.source_name = TypeAttributePersistence._property_from_data_to_string(data.sourceName)

        if data.get('sourceOrdering') is not None:
            type_attribute.source_ordering = TypeAttributePersistence._property_from_data_to_int(data.sourceOrdering)

        if data.get('displayName'):
            type_attribute.display_name = TypeAttributePersistence._property_from_data_to_string(data.displayName)

        if data.get('description'):
            type_attribute.description = TypeAttributePersistence._property_from_data_to_string(data.description)

        if data.get('valueConstrainedToList') is not None:
            type_attribute.value_constrained_to_list = TypeAttributePersistence._property_from_data_to_bool(data.valueConstrainedToList)

        if data.get('maximumLength') is not None:
            type_attribute.maximum_length = TypeAttributePersistence._property_from_data_to_int(data.maximumLength)

        if data.get('maximumValue') is not None:
            type_attribute.maximum_value = TypeAttributePersistence._property_from_data_to_string(data.maximumValue)

        if data.get('minimumValue') is not None:
            type_attribute.minimum_value = TypeAttributePersistence._property_from_data_to_string(data.minimumValue)

        if data.get('dataFormat') is not None:
            try:
                type_attribute.data_format = TypeAttributePersistence._data_type_from_data(data.dataFormat)
            except ValueError:
                logger.warning(TypeAttributePersistence.__name__, ctx, 'Couldn\'t find an enum value for {}.'.format(
                    data.dataFormat), TypeAttributePersistence.from_data.__name__)

        if data.get('defaultValue') is not None:
            type_attribute.default_value = data.defaultValue

        return type_attribute

    @staticmethod
    def to_data(instance: CdmTypeAttributeDefinition, res_opt: ResolveOptions, options: CopyOptions) -> TypeAttribute:
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
        data.attributeContext = AttributeContextReferencePersistence.to_data(
            instance.attribute_context, res_opt, options) if instance.attribute_context else None

        is_read_only = instance._fetch_property('isReadOnly')
        if is_read_only:
            data.isReadOnly = is_read_only

        is_nullable = instance._fetch_property('isNullable')
        if is_nullable:
            data.isNullable = is_nullable

        data.sourceName = instance._fetch_property('sourceName')

        source_ordering = instance._fetch_property('sourceOrdering')
        if source_ordering:
            data.sourceOrdering = source_ordering

        data.displayName = instance._fetch_property('displayName')
        data.description = instance._fetch_property('description')

        value_constrained_to_list = instance._fetch_property('valueConstrainedToList')
        if value_constrained_to_list:
            data.valueConstrainedToList = value_constrained_to_list

        is_primary_key = instance._fetch_property('isPrimaryKey')
        if is_primary_key:
            data.isPrimaryKey = is_primary_key

        data.maximumLength = instance._fetch_property('maximumLength')
        data.maximumValue = instance._fetch_property('maximumValue')
        data.minimumValue = instance._fetch_property('minimumValue')

        data_format = instance._fetch_property('dataFormat')
        if data_format != CdmDataFormat.UNKNOWN:
            data.dataFormat = data_format.value

        default_value = instance._fetch_property('defaultValue')
        if default_value:
            data.defaultValue = default_value

        return data

    @staticmethod
    def _property_from_data_to_string(value) -> Optional[str]:
        if isinstance(value, str) and value is not '':
            return value
        elif isinstance(value, int):
            return str(value)
        return None

    @staticmethod
    def _property_from_data_to_int(value) -> Optional[int]:
        if isinstance(value, int):
            return value
        elif isinstance(value, str):
            try:
                return int(value)
            except ValueError:
                # string is not a valid number
                pass
        return None

    @staticmethod
    def _property_from_data_to_bool(value) -> Optional[bool]:
        if isinstance(value, bool):
            return value
        elif isinstance(value, str):
            if value in ['True', 'true']:
                return True
            elif value in ['False', 'false']:
                return False
        return None

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
