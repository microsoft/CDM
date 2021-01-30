# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.persistence.cdmfolder.types import OperationExcludeAttributes

from .operation_base_persistence import OperationBasePersistence

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmOperationExcludeAttributes
    from cdm.utilities import ResolveOptions, CopyOptions


class OperationExcludeAttributesPersistence:
    """Operation ExcludeAttributes persistence"""

    @staticmethod
    def from_data(ctx: 'CdmCorpusContext', data: 'OperationExcludeAttributes') -> 'CdmOperationExcludeAttributes':
        if not data:
            return None

        exclude_attributes_op = OperationBasePersistence.from_data(ctx,
            CdmObjectType.OPERATION_EXCLUDE_ATTRIBUTES_DEF, data)  # type: CdmOperationExcludeAttributes
        exclude_attributes_op.exclude_attributes = data.excludeAttributes

        return exclude_attributes_op

    @staticmethod
    def to_data(instance: 'CdmOperationExcludeAttributes', res_opt: 'ResolveOptions', options: 'CopyOptions') -> 'OperationExcludeAttributes':
        if not instance:
            return None

        obj = OperationBasePersistence.to_data(instance, res_opt, options)  # type: OperationExcludeAttributes
        obj.excludeAttributes = instance.exclude_attributes

        return obj
