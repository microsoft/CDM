# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import List, TYPE_CHECKING

from cdm.enums import CdmDataFormat, CdmObjectType
from cdm.utilities import TraitToPropertyMap, copy_data_utils

from . import extension_helper, utils
from .types import Attribute

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmTraitDefinition, CdmTypeAttributeDefinition
    from cdm.utilities import CopyOptions, ResolveOptions


class TypeAttributePersistence:
    @staticmethod
    async def from_data(ctx: 'CdmCorpusContext', data: 'Attribute', extension_trait_def_list: List['CdmTraitDefinition'],
                        local_extension_trait_def_list: List['CdmTraitDefinition']) -> 'CdmTypeAttributeDefinition':
        attribute = ctx.corpus.make_object(CdmObjectType.TYPE_ATTRIBUTE_DEF, '{} attribute'.format(data.name))
        attribute.name = data.name

        # Do a conversion between CDM data format and model.json data type.
        attribute.data_format = TypeAttributePersistence._data_type_from_data(data.dataType.lower())
        attribute.description = data.get('description')

        if data.get('isHidden'):
            is_hidden_trait = ctx.corpus.make_object(CdmObjectType.TRAIT_REF, 'is.hidden')
            is_hidden_trait.is_from_property = True
            attribute.applied_traits.append(is_hidden_trait)

        await utils.process_annotations_from_data(ctx, data, attribute.applied_traits)
        extension_helper.process_extension_from_json(ctx, data, attribute.applied_traits, extension_trait_def_list, local_extension_trait_def_list)

        return attribute

    @staticmethod
    async def to_data(instance: 'CdmTypeAttributeDefinition', res_opt: 'ResolveOptions', options: 'CopyOptions') -> 'Attribute':
        applied_traits = \
            [trait for trait in instance.applied_traits if not trait.is_from_property] \
            if instance.applied_traits else None
        result = Attribute()

        result.name = instance.name
        description = instance._fetch_property('description')
        if description:
            result.description = description
        result.dataType = TypeAttributePersistence._data_type_to_data(instance.data_format)
        result.traits = copy_data_utils._array_copy_data(res_opt, applied_traits, options)

        await utils.process_annotations_to_data(instance.ctx, result, instance.applied_traits)

        t2pm = TraitToPropertyMap(instance)

        result.isHidden = bool(t2pm._fetch_trait_reference('is.hidden')) or None

        return result

    @staticmethod
    def _data_type_from_data(data_type: str):
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

        return data_type_from_data.get(data_type, CdmDataFormat.UNKNOWN)

    @staticmethod
    def _data_type_to_data(data_format: 'CdmDataFormat'):
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

        return data_type_to_data.get(data_format, "unclassified")
