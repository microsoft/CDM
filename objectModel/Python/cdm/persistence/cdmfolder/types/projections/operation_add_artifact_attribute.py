# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Union
from cdm.persistence.cdmfolder.types.projections.operation_base import OperationBase
from cdm.persistence.cdmfolder.types.type_attribute import TypeAttribute
from cdm.persistence.cdmfolder.types.entity_attribute import EntityAttribute
from cdm.persistence.cdmfolder.types import AttributeGroupReference


class OperationAddArtifactAttribute(OperationBase):
    """OperationAddArtifactAttribute class"""

    def __init__(self):
        super().__init__()

        self.newAttribute = None  # type: Union[str, AttributeGroupReference, TypeAttribute, EntityAttribute]
        self.insertAtTop = None
