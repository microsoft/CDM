# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.persistence.cdmfolder.types import OperationAddArtifactAttribute

from .operation_base_persistence import OperationBasePersistence
from .. import utils

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmOperationAddArtifactAttribute
    from cdm.utilities import ResolveOptions, CopyOptions

_TAG = 'OperationAddArtifactAttributePersistence'


class OperationAddArtifactAttributePersistence:
    """Operation AddArtifactAttribute persistence"""

    @staticmethod
    def from_data(ctx: 'CdmCorpusContext', data: 'OperationAddArtifactAttribute') -> 'CdmOperationAddArtifactAttribute':
        if not data:
            return None

        add_artifact_attribute_op = OperationBasePersistence.from_data(ctx,
            CdmObjectType.OPERATION_ADD_ARTIFACT_ATTRIBUTE_DEF, data)  # type: CdmOperationAddArtifactAttribute
        
        add_artifact_attribute_op.new_attribute = utils.create_attribute(ctx, data.newAttribute)
        add_artifact_attribute_op.insert_at_top = data.insertAtTop

        return add_artifact_attribute_op

    @staticmethod
    def to_data(instance: 'CdmOperationAddArtifactAttribute', res_opt: 'ResolveOptions', options: 'CopyOptions') -> 'OperationAddArtifactAttribute':
        from cdm.persistence.cdmfolder.type_attribute_persistence import TypeAttributePersistence
        from cdm.objectmodel import CdmTypeAttributeDefinition
        if not instance:
            return None

        obj = OperationBasePersistence.to_data(instance, res_opt, options)  # type: OperationAddArtifactAttribute
        if isinstance(instance.new_attribute, CdmTypeAttributeDefinition):
            obj.newAttribute = TypeAttributePersistence.to_data(instance.new_attribute, res_opt, options)
        obj.newAttribute = instance.new_attribute
        obj.insertAtTop = instance.insert_at_top

        return obj
