# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.persistence.cdmfolder import utils
from cdm.persistence.cdmfolder.types import OperationReplaceAsForeignKey

from .operation_base_persistence import OperationBasePersistence

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmOperationReplaceAsForeignKey
    from cdm.utilities import ResolveOptions, CopyOptions


class OperationReplaceAsForeignKeyPersistence:
    """Operation ReplaceAsForeignKey persistence"""

    @staticmethod
    def from_data(ctx: 'CdmCorpusContext', data: 'OperationReplaceAsForeignKey') -> 'CdmOperationReplaceAsForeignKey':
        if not data:
            return None

        replace_as_foreign_key_op = OperationBasePersistence.from_data(ctx,
            CdmObjectType.OPERATION_REPLACE_AS_FOREIGN_KEY_DEF, data)  # type: CdmOperationReplaceAsForeignKey
        replace_as_foreign_key_op.reference = data.reference
        replace_as_foreign_key_op.replace_with = utils.create_attribute(ctx, data.replaceWith)

        return replace_as_foreign_key_op

    @staticmethod
    def to_data(instance: 'CdmOperationReplaceAsForeignKey', res_opt: 'ResolveOptions', options: 'CopyOptions') -> 'OperationReplaceAsForeignKey':
        from cdm.persistence.cdmfolder.type_attribute_persistence import TypeAttributePersistence

        if not instance:
            return None

        obj = OperationBasePersistence.to_data(instance, res_opt, options)  # type: OperationReplaceAsForeignKey
        obj.reference = instance.reference
        obj.replaceWith = TypeAttributePersistence.to_data(instance.replace_with, res_opt, options)

        return obj
