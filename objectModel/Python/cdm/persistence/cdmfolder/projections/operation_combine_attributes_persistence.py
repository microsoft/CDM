# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.persistence.cdmfolder import utils
from cdm.persistence.cdmfolder.types import OperationCombineAttributes

from .operation_base_persistence import OperationBasePersistence

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmOperationCombineAttributes
    from cdm.utilities import ResolveOptions, CopyOptions

_TAG = 'OperationCombineAttributesPersistence'


class OperationCombineAttributesPersistence:
    """Operation CombineAttributes persistence"""

    @staticmethod
    def from_data(ctx: 'CdmCorpusContext', data: 'OperationCombineAttributes') -> 'CdmOperationCombineAttributes':
        if not data:
            return None
        
        combine_attributes_op = OperationBasePersistence.from_data(ctx,
            CdmObjectType.OPERATION_COMBINE_ATTRIBUTES_DEF, data)  # type: CdmOperationCombineAttributes
        combine_attributes_op.select = data.select
        combine_attributes_op.merge_into = utils.create_attribute(ctx, data.mergeInto)

        return combine_attributes_op

    @staticmethod
    def to_data(instance: 'CdmOperationCombineAttributes', res_opt: 'ResolveOptions', options: 'CopyOptions') -> 'OperationCombineAttributes':
        from cdm.persistence.cdmfolder.type_attribute_persistence import TypeAttributePersistence

        if not instance:
            return None

        obj = OperationBasePersistence.to_data(instance, res_opt, options)  # type: OperationCombineAttributes
        obj.select = instance.select
        obj.mergeInto = TypeAttributePersistence.to_data(instance.merge_into, res_opt, options)

        return obj
