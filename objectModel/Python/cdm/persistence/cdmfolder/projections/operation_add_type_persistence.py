# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.persistence.cdmfolder import utils
from cdm.persistence.cdmfolder.types import OperationAddTypeAttribute

from .operation_base_persistence import OperationBasePersistence

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmOperationAddTypeAttribute
    from cdm.utilities import ResolveOptions, CopyOptions


class OperationAddTypeAttributePersistence:
    """Operation AddTypeAttribute persistence"""

    @staticmethod
    def from_data(ctx: 'CdmCorpusContext', data: 'OperationAddTypeAttribute') -> 'CdmOperationAddTypeAttribute':
        if not data:
            return None

        add_type_attribute_op = OperationBasePersistence.from_data(ctx,
            CdmObjectType.OPERATION_ADD_TYPE_ATTRIBUTE_DEF, data)  # type: CdmOperationAddTypeAttribute
        add_type_attribute_op.type_attribute = utils.create_attribute(ctx, data.typeAttribute)

        return add_type_attribute_op

    @staticmethod
    def to_data(instance: 'CdmOperationAddTypeAttribute', res_opt: 'ResolveOptions', options: 'CopyOptions') -> 'OperationAddTypeAttribute':
        from cdm.persistence.cdmfolder.type_attribute_persistence import TypeAttributePersistence

        if not instance:
            return None

        obj = OperationBasePersistence.to_data(instance, res_opt, options)  # type: OperationAddTypeAttribute
        obj.typeAttribute = TypeAttributePersistence.to_data(instance.type_attribute, res_opt, options)

        return obj
