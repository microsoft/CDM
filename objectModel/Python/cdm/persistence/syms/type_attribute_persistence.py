# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional

from cdm.objectmodel import CdmCorpusContext, CdmTypeAttributeDefinition, CdmTraitGroupReference
from cdm.enums import CdmDataFormat, CdmObjectType
from cdm.utilities import logger, ResolveOptions, CopyOptions, TraitToPropertyMap, copy_data_utils
from cdm.enums import CdmLogCode
from cdm.persistence.syms.models import ColumnRelationshipInformation, DataColumn, DataSource, \
    DatabaseEntity, DatabaseProperties, FormatInfo, Namespace, PartitionInfo, PartitionInfoNamespace, \
    PartitionInfoProperties, RelationshipEntity, RelationshipProperties, SASEntityType, ScalarTypeInfo, \
    SchemaEntity, StorageDescriptor, TableEntity, TableNamespace, TablePartitioning, TableProperties, \
    TypeInfo

from . import utils
from .attribute_context_reference_persistence import AttributeContextReferencePersistence
from .attribute_resolution_guidance_persistence import AttributeResolutionGuidancePersistence
from .data_type_reference_persistence import DataTypeReferencePersistence
from .purpose_reference_persistence import PurposeReferencePersistence
from cdm.objectmodel.projections.cardinality_settings import CardinalitySettings
from .types import TypeAttribute
from cdm.persistence.syms.models import ColumnRelationshipInformation, DataColumn, DataSource, DatabaseEntity, \
    DatabaseProperties, FormatInfo, Namespace, PartitionInfo, PartitionInfoNamespace, PartitionInfoProperties, \
    RelationshipEntity, RelationshipProperties, ScalarTypeInfo, SchemaEntity, StorageDescriptor, TableEntity, \
    TableNamespace, TablePartitioning, TableProperties, TypeInfo

_TAG = 'TypeAttributePersistence'

class TypeAttributePersistence:
    @staticmethod
    def from_data(ctx: CdmCorpusContext, obj: DataColumn,
                  entity_name: Optional[str] = None) -> CdmTypeAttributeDefinition:
        type_attribute = ctx.corpus.make_object(CdmObjectType.TYPE_ATTRIBUTE_DEF, obj.name)
        properties = obj.origin_data_type_name.properties

        type_attribute.data_format = utils.syms_data_type_to_cdm_data_format(obj.origin_data_type_name)
        type_attribute.is_nullable = obj.origin_data_type_name.is_nullable

        if obj.origin_data_type_name.scale != 0 or obj.origin_data_type_name.precision != 0:
            numeric_traits = ctx.corpus.make_ref(CdmObjectType.TRAIT_REF, 'is.data_format.numeric.shaped', True)
        
            scale_traits_arg = ctx.corpus.make_ref(CdmObjectType.ARGUMENT_DEF, 'scale', False)
            scale_traits_arg.Value = obj.origin_data_type_name.scale
            numeric_traits.arguments.append(scale_traits_arg)
        
            precision_traits_arg = ctx.corpus.make_ref(CdmObjectType.ARGUMENT_DEF, 'scale', False)
            precision_traits_arg.value = obj.origin_data_type_name.scale
            numeric_traits.arguments.append(precision_traits_arg)

        if properties is not None:
            if 'cdm:purpose' in properties:
                type_attribute.purpose = properties['cdm:purpose']
            if 'cdm:dataType' in properties:
                type_attribute.data_type = properties['cdm:dataType']
            if 'cdm:traits' in properties:
                utils.add_list_to_cdm_collection(type_attribute.applied_traits, utils.create_trait_reference_array(ctx, properties['cdm:traits']))
            if 'cdm:is_primary_key' in properties and properties['cdm:is_primary_key']:
                t2pMap = TraitToPropertyMap(type_attribute)
                t2pMap._update_property_value('is_primary_key', entity_name + '/(resolvedAttributes)/' + type_attribute.name)
            if 'cdm:isReadOnly' in properties:
                type_attribute.is_read_only = properties['cdm:isReadOnly']
            if 'cdm:sourceName' in properties:
                type_attribute.source_name = properties['cdm:source_name']
            if 'cdm:sourceOrdering' in properties:
                type_attribute.source_ordering = properties['cdm:sourceOrdering']
            if 'cdm:valueConstrainedToList' in properties:
                type_attribute.value_constrained_to_list = properties['cdm:valueConstrainedToList']
            if 'cdm:maximumLength' in properties:
                type_attribute.maximum_length = properties['cdm:maximumLength']
            if 'cdm:maximumValue' in properties:
                type_attribute.maximum_value = properties['cdm:maximumValue']
            if 'cdm:minimumValue' in properties:
                type_attribute.minimum_value = properties['cdm:minimumValue']
            if 'cdm:defaultValue' in properties:
                type_attribute.default_value = properties['cdm:defaultValue']
            return type_attribute

    def to_data(instance: CdmTypeAttributeDefinition, ctx: CdmCorpusContext, res_opt: ResolveOptions, options: CopyOptions) -> TypeAttribute:
        properties = TypeAttributePersistence.create_properties(instance, res_opt, options)
        origin_data_type_name = TypeInfo(
        type_name = '',
        properties = properties,
        is_complex_type = False,
        is_nullable = instance._get_property('isNullable'),
        type_family = 'cdm')

        t2pm = TraitToPropertyMap(instance)
        numeric_traits = t2pm._fetch_trait_reference('is.data_format.numeric.shaped')
        if numeric_traits is not None:
            for numeric_traits_arg in numeric_traits.argument:
                if numeric_traits_arg.name == 'precision':
                    origin_data_type_name.precision = numeric_traits_arg.value
                if numeric_traits_arg.Name == 'scale':
                    origin_data_type_name.scale = numeric_traits_arg.value

        data_format = instance._get_property('dataFormat')
        origin_data_type_name = utils.cdm_data_format_to_syms_data_type(data_format, origin_data_type_name)
        if origin_data_type_name == None:
            return None
        if origin_data_type_name.type_name == None:
            logger.error(ctx, _TAG, 'toData', instance.at_corpus_path, CdmLogCode.ERR_PERSIST_SYMS_UNKNOWN_DATA_FORMAT,
                             instance.display_name)
            return None

        data_col = DataColumn(
        origin_data_type_name = origin_data_type_name,
        name = instance.name)
        return data_col

    @staticmethod
    def create_properties(instance: CdmTypeAttributeDefinition, res_opt: ResolveOptions, options: CopyOptions):
        properties = {}
    
        display_name = instance._get_property('display_name')
        source_name = instance._get_property('source_name')
        description = instance._get_property('description')
        is_read_only = instance._get_property('isReadOnly')
        maximum_length = instance._get_property('maximum_length')
        maximum_value = instance._get_property('maximum_value')
        minimum_value = instance._get_property('minimum_value')
        source_ordering = instance._get_property('source_ordering')
        value_constrained_to_list = instance._get_property('value_constrained_to_list')
        is_primary_key = instance._get_property('is_primary_key')
        def_value = instance._get_property('defaultValue')

        if display_name is not None:
            properties['cdm:display_name'] = display_name

        if instance.explanation is not None:
            properties['cdm:explanation'] = instance.explanation

        if source_name is not None:
            properties['cdm:source_name'] = source_name

        if description is not None:
            properties['cdm:description'] = description

        if instance.applied_traits is not None and len(instance.applied_traits) > 0:
            applied_traits = \
                [trait for trait in instance.applied_traits
                 if isinstance(trait, CdmTraitGroupReference) or not trait.is_from_property] \
                    if instance.applied_traits else None
            properties['cdm:traits'] = copy_data_utils._array_copy_data(res_opt, applied_traits, options)
                       
        if is_read_only is not None:
            properties['cdm:isReadOnly'] = is_read_only
        
        if maximum_length is not None:
            properties['cdm:maximumLength'] = maximum_length
        
        if maximum_value is not None:
            properties['cdm:maximumValue'] = maximum_value
        
        if minimum_value is not None:
            properties['cdm:minimumValue'] = minimum_value

        if source_ordering is not None and source_ordering != 0:
            properties['cdm:sourceOrdering'] = source_ordering

        if value_constrained_to_list is not None:
            properties['cdm:valueConstrainedToList'] = value_constrained_to_list

        if is_primary_key is not None:
            properties['cdm:isPrimaryKey'] = is_primary_key

        if def_value is not None:
            properties['cdm:defaultValue'] = def_value

        return properties