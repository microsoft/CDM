# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import TYPE_CHECKING

from cdm.enums import CdmObjectType, CdmLogCode
from cdm.persistence.cdmfolder.types import OperationRenameAttributes
from cdm.utilities.logging import logger

from .operation_base_persistence import OperationBasePersistence

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmOperationRenameAttributes
    from cdm.utilities import ResolveOptions, CopyOptions

_TAG = 'OperationRenameAttributesPersistence'


class OperationRenameAttributesPersistence:
    """Operation RenameAttributes persistence"""

    @staticmethod
    def from_data(ctx: 'CdmCorpusContext', data: 'OperationRenameAttributes') -> 'CdmOperationRenameAttributes':
        if not data:
            return None

        rename_attributes_op = OperationBasePersistence.from_data(ctx,
            CdmObjectType.OPERATION_RENAME_ATTRIBUTES_DEF, data)  # type: CdmOperationRenameAttributes
        
        rename_attributes_op.rename_format = data.renameFormat
        if isinstance(data.applyTo, str):
            rename_attributes_op.apply_to = [data.applyTo]
        elif isinstance(data.applyTo, list):
            rename_attributes_op.apply_to = data.applyTo
        elif data.applyTo is not None:
            logger.error(ctx, _TAG, OperationRenameAttributesPersistence.from_data.__name__, None, CdmLogCode.ERR_PERSIST_PROJ_UNSUPPORTED_PROP)

        return rename_attributes_op

    @staticmethod
    def to_data(instance: 'CdmOperationRenameAttributes', res_opt: 'ResolveOptions', options: 'CopyOptions') -> 'OperationRenameAttributes':
        if not instance:
            return None

        obj = OperationBasePersistence.to_data(instance, res_opt, options)  # type: OperationRenameAttributes
        obj.renameFormat = instance.rename_format
        obj.applyTo = instance.apply_to

        return obj
