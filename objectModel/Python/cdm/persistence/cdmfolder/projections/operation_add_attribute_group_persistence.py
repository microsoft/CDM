# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.persistence.cdmfolder.types import OperationAddAttributeGroup

from .operation_base_persistence import OperationBasePersistence

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmOperationAddAttributeGroup
    from cdm.utilities import ResolveOptions, CopyOptions


class OperationAddAttributeGroupPersistence:
    """Operation AddAttributeGroup persistence"""

    @staticmethod
    def from_data(ctx: 'CdmCorpusContext', data: 'OperationAddAttributeGroup') -> 'CdmOperationAddAttributeGroup':
        if not data:
            return None

        add_attribute_group_op = OperationBasePersistence.from_data(ctx,
            CdmObjectType.OPERATION_ADD_ATTRIBUTE_GROUP_DEF, data)  # type: CdmOperationAddAttributeGroup
        add_attribute_group_op.attribute_group_name = data.attributeGroupName

        return add_attribute_group_op

    @staticmethod
    def to_data(instance: 'CdmOperationAddAttributeGroup', res_opt: 'ResolveOptions', options: 'CopyOptions') -> 'OperationAddAttributeGroup':
        if not instance:
            return None

        obj = OperationBasePersistence.to_data(instance, res_opt, options)  # type: OperationAddAttributeGroup
        obj.attributeGroupName = instance.attribute_group_name

        return obj
