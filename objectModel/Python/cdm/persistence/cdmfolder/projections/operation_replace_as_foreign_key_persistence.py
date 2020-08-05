# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.enums.cdm_operation_type import OperationTypeConvertor, CdmOperationType

from cdm.persistence.cdmfolder import utils
from cdm.persistence.cdmfolder.types import OperationReplaceAsForeignKey
from cdm.utilities.logging import logger
from cdm.utilities.string_utils import StringUtils

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmOperationReplaceAsForeignKey
    from cdm.utilities import ResolveOptions, CopyOptions

_TAG = 'OperationReplaceAsForeignKeyPersistence'


class OperationReplaceAsForeignKeyPersistence:
    """Operation ReplaceAsForeignKey persistence"""

    @staticmethod
    def from_data(ctx: 'CdmCorpusContext', data: 'OperationReplaceAsForeignKey') -> 'CdmOperationReplaceAsForeignKey':
        if not data:
            return None

        replace_as_foreign_key_op = ctx.corpus.make_object(CdmObjectType.OPERATION_REPLACE_AS_FOREIGN_KEY_DEF)

        if data.type and not StringUtils.equals_with_ignore_case(data.type, OperationTypeConvertor._operation_type_to_string(CdmOperationType.REPLACE_AS_FOREIGN_KEY)):
            logger.error(_TAG, ctx, '$type {} is invalid for this operation.'.format(data.type))
        else:
            replace_as_foreign_key_op.type = CdmOperationType.REPLACE_AS_FOREIGN_KEY

        if data.explanation:
            replace_as_foreign_key_op.explanation = data.explanation

        replace_as_foreign_key_op.reference = data.reference

        if data.replaceWith:
            replace_as_foreign_key_op.replace_with = utils.create_attribute(ctx, data.replaceWith)

        return replace_as_foreign_key_op

    @staticmethod
    def to_data(instance: 'CdmOperationReplaceAsForeignKey', res_opt: 'ResolveOptions', options: 'CopyOptions') -> 'OperationReplaceAsForeignKey':
        from cdm.persistence.cdmfolder.type_attribute_persistence import TypeAttributePersistence

        if not instance:
            return None

        obj = OperationReplaceAsForeignKey()
        obj.type = OperationTypeConvertor._operation_type_to_string(CdmOperationType.REPLACE_AS_FOREIGN_KEY)
        obj.explanation = instance.explanation
        obj.reference = instance.reference
        obj.replaceWith = TypeAttributePersistence.to_data(instance.replace_with, res_opt, options)

        return obj
