# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.persistence.cdmfolder import utils
from cdm.persistence.cdmfolder.types import OperationAddCountAttribute

from .operation_base_persistence import OperationBasePersistence

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmOperationAddCountAttribute
    from cdm.utilities import ResolveOptions, CopyOptions


class OperationAddCountAttributePersistence:
    """Operation AddCountAttribute persistence"""

    @staticmethod
    def from_data(ctx: 'CdmCorpusContext', data: 'OperationAddCountAttribute') -> 'CdmOperationAddCountAttribute':
        if not data:
            return None

        add_count_attribute_op = OperationBasePersistence.from_data(ctx,
            CdmObjectType.OPERATION_ADD_COUNT_ATTRIBUTE_DEF, data)  # type: CdmOperationAddCountAttribute
        add_count_attribute_op.count_attribute = utils.create_attribute(ctx, data.countAttribute)

        return add_count_attribute_op

    @staticmethod
    def to_data(instance: 'CdmOperationAddCountAttribute', res_opt: 'ResolveOptions', options: 'CopyOptions') -> 'OperationAddCountAttribute':
        from cdm.persistence.cdmfolder.type_attribute_persistence import TypeAttributePersistence

        if not instance:
            return None

        obj = OperationBasePersistence.to_data(instance, res_opt, options)  # type: OperationAddCountAttribute
        obj.countAttribute = TypeAttributePersistence.to_data(instance.count_attribute, res_opt, options)

        return obj
