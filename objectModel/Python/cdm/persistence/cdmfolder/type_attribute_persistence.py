from cdm.objectmodel import CdmCorpusContext, CdmTypeAttributeDefinition
from cdm.enums import CdmDataFormat, CdmObjectType
from cdm.utilities import ResolveOptions, CopyOptions

from . import utils
from .attribute_context_reference_persistence import AttributeContextReferencePersistence
from .attribute_resolution_guidance_persistence import AttributeResolutionGuidancePersistence
from .data_type_reference_persistence import DataTypeReferencePersistence
from .purpose_reference_persistence import PurposeReferencePersistence
from .types import TypeAttribute


class TypeAttributePersistence:
    @staticmethod
    def from_data(ctx: CdmCorpusContext, data: TypeAttribute) -> CdmTypeAttributeDefinition:
        type_attribute = ctx.corpus.make_object(CdmObjectType.TYPE_ATTRIBUTE_DEF, data.name)
        type_attribute.purpose = PurposeReferencePersistence.from_data(ctx, data.get('purpose'))
        type_attribute.data_type = DataTypeReferencePersistence.from_data(ctx, data.get('dataType'))
        type_attribute.attribute_context = AttributeContextReferencePersistence.from_data(ctx, data.get('attributeContext'))
        type_attribute.resolution_guidance = AttributeResolutionGuidancePersistence.from_data(ctx, data.get('resolutionGuidance'))

        applied_traits = utils.create_trait_reference_array(ctx, data.get('appliedTraits'))
        type_attribute.applied_traits.extend(applied_traits)

        type_attribute.explanation = data.get('explanation')
        if data.get('isReadOnly'):
            type_attribute.is_read_only = data.isReadOnly

        if data.get('isNullable'):
            type_attribute.is_nullable = data.isNullable

        if data.get('sourceName'):
            type_attribute.source_name = data.sourceName

        if data.get('sourceOrdering'):
            type_attribute.source_ordering = data.sourceOrdering

        if data.get('displayName'):
            type_attribute.display_name = data.displayName

        if data.get('description'):
            type_attribute.description = data.description

        if data.get('valueConstrainedToList'):
            type_attribute.value_constrained_to_list = data.valueConstrainedToList

        if data.get('maximumLength'):
            type_attribute.maximum_length = data.maximumLength

        if data.get('maximumValue'):
            type_attribute.maximum_value = data.maximumValue

        if data.get('minimumValue'):
            type_attribute.minimum_value = data.minimumValue

        if data.get('dataFormat'):
            try:
                type_attribute.data_format = CdmDataFormat(data.dataFormat)
            except ValueError:
                ctx.logger.error(data.dataFormat + ' is not a valid data format')

        if data.get('defaultValue'):
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
        data.appliedTraits = utils.array_copy_data(res_opt, applied_traits, options)
        data.resolutionGuidance = AttributeResolutionGuidancePersistence.to_data(
            instance.resolution_guidance, res_opt, options) if instance.resolution_guidance else None
        data.attributeContext = AttributeContextReferencePersistence.to_data(
            instance.attribute_context, res_opt, options) if instance.attribute_context else None

        is_read_only = instance.fetch_property('isReadOnly')
        if is_read_only:
            data.isReadOnly = is_read_only

        is_nullable = instance.fetch_property('isNullable')
        if is_nullable:
            data.isNullable = is_nullable

        source_name = instance.fetch_property('sourceName')
        if source_name:
            data.sourceName = source_name

        source_ordering = instance.fetch_property('sourceOrdering')
        if source_ordering:
            data.sourceOrdering = source_ordering

        display_name = instance.fetch_property('displayName')
        if display_name:
            data.displayName = display_name

        description = instance.fetch_property('description')
        if description:
            data.description = description

        value_constrained_to_list = instance.fetch_property('valueConstrainedToList')
        if value_constrained_to_list:
            data.valueConstrainedToList = value_constrained_to_list

        is_primary_key = instance.fetch_property('isPrimaryKey')
        if is_primary_key:
            data.isPrimaryKey = is_primary_key

        maximum_length = instance.fetch_property('maximumLength')
        if maximum_length:
            data.maximumLength = maximum_length

        maximum_value = instance.fetch_property('maximumValue')
        if maximum_value:
            data.maximumValue = maximum_value

        minimum_value = instance.fetch_property('minimumValue')
        if minimum_value:
            data.minimumValue = minimum_value

        data_format = instance.fetch_property('dataFormat')
        if data_format != CdmDataFormat.UNKNOWN:
            data.dataFormat = data_format.value

        default_value = instance.fetch_property('defaultValue')
        if default_value:
            data.defaultValue = default_value

        return data
