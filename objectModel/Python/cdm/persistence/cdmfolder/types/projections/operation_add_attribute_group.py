# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional

from cdm.persistence.cdmfolder.types.projections.operation_base import OperationBase


class OperationAddAttributeGroup(OperationBase):
    """OperationAddAttributeGroup class"""

    def __init__(self):
        super().__init__()

        self.attributeGroupName = None  # type: Optional[str]
