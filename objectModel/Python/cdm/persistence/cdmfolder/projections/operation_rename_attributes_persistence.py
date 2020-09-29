# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.enums.cdm_operation_type import CdmOperationType, OperationTypeConvertor

from cdm.persistence.cdmfolder.types import OperationRenameAttributes
from cdm.utilities.logging import logger
from cdm.utilities.string_utils import StringUtils

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

        rename_attributes_op = ctx.corpus.make_object(CdmObjectType.OPERATION_RENAME_ATTRIBUTES_DEF)

        if data.type and not StringUtils.equals_with_ignore_case(data.type, OperationTypeConvertor._operation_type_to_string(CdmOperationType.RENAME_ATTRIBUTES)):
            logger.error(_TAG, ctx, '$type {} is invalid for this operation.'.format(data.type))
        else:
            rename_attributes_op.type = CdmOperationType.RENAME_ATTRIBUTES

        if data.explanation:
            rename_attributes_op.explanation = data.explanation

        rename_attributes_op.rename_format = data.renameFormat
        if isinstance(data.applyTo, str):
            rename_attributes_op.apply_to = [data.applyTo]
        elif isinstance(data.applyTo, list):
            rename_attributes_op.apply_to = data.applyTo
        elif data.applyTo is not None:
            logger.error(_TAG, ctx, 'Unsupported: applyTo property type should be string or List<string>.')

        return rename_attributes_op

    @staticmethod
    def to_data(instance: 'CdmOperationRenameAttributes', res_opt: 'ResolveOptions', options: 'CopyOptions') -> 'OperationRenameAttributes':
        if not instance:
            return None

        obj = OperationRenameAttributes()
        obj.type = OperationTypeConvertor._operation_type_to_string(CdmOperationType.RENAME_ATTRIBUTES)
        obj.explanation = instance.explanation
        obj.renameFormat = instance.rename_format
        obj.applyTo = instance.apply_to

        return obj
