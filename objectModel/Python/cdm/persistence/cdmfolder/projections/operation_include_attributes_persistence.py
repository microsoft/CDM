# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.persistence.cdmfolder.types import OperationIncludeAttributes

from .operation_base_persistence import OperationBasePersistence

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmOperationIncludeAttributes
    from cdm.utilities import ResolveOptions, CopyOptions


class OperationIncludeAttributesPersistence:
    """Operation IncludeAttributes persistence"""

    @staticmethod
    def from_data(ctx: 'CdmCorpusContext', data: 'OperationIncludeAttributes') -> 'CdmOperationIncludeAttributes':
        if not data:
            return None

        include_attributes_op = OperationBasePersistence.from_data(ctx,
            CdmObjectType.OPERATION_INCLUDE_ATTRIBUTES_DEF, data)  # type: OperationIncludeAttributes
        include_attributes_op.include_attributes = data.includeAttributes

        return include_attributes_op

    @staticmethod
    def to_data(instance: 'CdmOperationIncludeAttributes', res_opt: 'ResolveOptions', options: 'CopyOptions') -> 'OperationIncludeAttributes':
        if not instance:
            return None

        obj = OperationBasePersistence.to_data(instance, res_opt, options)  # type: OperationIncludeAttributes
        obj.includeAttributes = instance.include_attributes

        return obj
