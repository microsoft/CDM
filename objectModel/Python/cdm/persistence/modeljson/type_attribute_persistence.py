from typing import List, TYPE_CHECKING

from cdm.enums import CdmDataFormat, CdmObjectType
from cdm.utilities import TraitToPropertyMap

from . import extension_helper, utils
from .types import Attribute

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmTraitDefinition, CdmTypeAttributeDefinition
    from cdm.utilities import CopyOptions, ResolveOptions


class TypeAttributePersistence:
    @staticmethod
    async def from_data(ctx: 'CdmCorpusContext', data: 'Attribute', extension_trait_def_list: List['CdmTraitDefinition']) -> 'CdmTypeAttributeDefinition':
        attribute = ctx.corpus.make_object(CdmObjectType.TYPE_ATTRIBUTE_DEF, '{} attribute'.format(data.name))
        attribute.name = data.name

        # Do a conversion between CDM data format and model.json data type.
        attribute.data_format = TypeAttributePersistence.data_type_from_data[data.dataType.lower()]
        attribute.description = data.get('description')

        if data.get('isHidden'):
            is_hidden_trait = ctx.corpus.make_object(CdmObjectType.TRAIT_REF, 'is.hidden')
            is_hidden_trait.is_from_property = True
            attribute.applied_traits.append(is_hidden_trait)

        await utils.process_annotations_from_data(ctx, data, attribute.applied_traits)
        await extension_helper.process_extension_from_json(ctx, data, attribute.applied_traits, extension_trait_def_list)

        return attribute

    @staticmethod
    async def to_data(instance: 'CdmTypeAttributeDefinition', res_opt: 'ResolveOptions', options: 'CopyOptions') -> 'Attribute':
        result = Attribute()

        result.name = instance.name
        result.description = instance.description
        result.dataType = TypeAttributePersistence.data_type_to_data[instance.data_format]

        await utils.process_annotations_to_data(instance.ctx, result, instance.applied_traits)

        t2pm = TraitToPropertyMap(instance)

        result.isHidden = bool(t2pm.fetch_trait_reference('is.hidden')) or None

        return result

    data_type_from_data = {
        'string': CdmDataFormat.STRING,
        'int64': CdmDataFormat.INT64,
        'double': CdmDataFormat.DOUBLE,
        'datetime': CdmDataFormat.DATE_TIME,
        'datetimeoffset': CdmDataFormat.DATE_TIME_OFFSET,
        'decimal': CdmDataFormat.DECIMAL,
        'boolean': CdmDataFormat.BOOLEAN,
        'guid': CdmDataFormat.GUID,
        'json': CdmDataFormat.JSON
    }

    data_type_to_data = {
        CdmDataFormat.INT16: 'int64',
        CdmDataFormat.INT32: 'int64',
        CdmDataFormat.INT64: 'int64',
        CdmDataFormat.FLOAT: 'double',
        CdmDataFormat.DOUBLE: 'double',
        CdmDataFormat.CHAR: 'string',
        CdmDataFormat.STRING: 'string',
        CdmDataFormat.GUID: 'guid',
        CdmDataFormat.BINARY: 'boolean',
        CdmDataFormat.TIME: 'dateTime',
        CdmDataFormat.DATE: 'dateTime',
        CdmDataFormat.DATE_TIME: 'dateTime',
        CdmDataFormat.DATE_TIME_OFFSET: 'dateTimeOffset',
        CdmDataFormat.BOOLEAN: 'boolean',
        CdmDataFormat.DECIMAL: 'decimal',
        CdmDataFormat.JSON: 'json'
    }
