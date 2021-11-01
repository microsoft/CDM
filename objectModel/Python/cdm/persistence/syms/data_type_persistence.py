# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from cdm.objectmodel import CdmCorpusContext, CdmDataTypeDefinition
from cdm.enums import CdmObjectType
from cdm.utilities import ResolveOptions, CopyOptions, copy_data_utils

from . import utils
from .types import DataType
from .data_type_reference_persistence import DataTypeReferencePersistence


class DataTypePersistence:
    @staticmethod
    def from_data(ctx: CdmCorpusContext, data: DataType) -> CdmDataTypeDefinition:
        if data is None:
            return None

        data_type = ctx.corpus.make_object(CdmObjectType.DATA_TYPE_DEF, data.dataTypeName)
        data_type.extends_data_type = DataTypeReferencePersistence.from_data(ctx, data.get('extendsDataType'))
        data_type.explanation = data.get('explanation')

        utils.add_list_to_cdm_collection(data_type.exhibits_traits,
                                         utils.create_trait_reference_array(ctx, data.get('exhibitsTraits')))

        return data_type

    @staticmethod
    def to_data(instance: CdmDataTypeDefinition, res_opt: ResolveOptions, options: CopyOptions) -> DataType:
        result = DataType()
        result.explanation = instance.explanation
        result.dataTypeName = instance.data_type_name
        result.extendsDataType = DataTypeReferencePersistence.to_data(instance.extends_data_type, res_opt, options) if instance.extends_data_type else None
        result.exhibitsTraits = copy_data_utils._array_copy_data(res_opt, instance.exhibits_traits, options)
        return result
