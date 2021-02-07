# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.persistence.cdmfolder import utils
from cdm.persistence.cdmfolder.types import OperationAddSupportingAttribute

from .operation_base_persistence import OperationBasePersistence

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmOperationAddSupportingAttribute
    from cdm.utilities import ResolveOptions, CopyOptions


class OperationAddSupportingAttributePersistence:
    """Operation AddSupportingAttribute persistence"""

    @staticmethod
    def from_data(ctx: 'CdmCorpusContext', data: 'OperationAddSupportingAttribute') -> 'CdmOperationAddSupportingAttribute':
        if not data:
            return None

        add_supporting_attribute_op = OperationBasePersistence.from_data(ctx,
            CdmObjectType.OPERATION_ADD_SUPPORTING_ATTRIBUTE_DEF, data)  # type: CdmOperationAddSupportingAttribute
        add_supporting_attribute_op.supporting_attribute = utils.create_attribute(ctx, data.supportingAttribute)

        return add_supporting_attribute_op

    @staticmethod
    def to_data(instance: 'CdmOperationAddSupportingAttribute', res_opt: 'ResolveOptions', options: 'CopyOptions') -> 'OperationAddSupportingAttribute':
        from cdm.persistence.cdmfolder.type_attribute_persistence import TypeAttributePersistence

        if not instance:
            return None

        obj = OperationBasePersistence.to_data(instance, res_opt, options)  # type: OperationAddSupportingAttribute
        obj.supportingAttribute = TypeAttributePersistence.to_data(instance.supporting_attribute, res_opt, options)

        return obj
