# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from cdm.persistence.cdmfolder.types.projections.operation_base import OperationBase


class OperationRenameAttributes(OperationBase):
    """OperationRename class"""

    def __init__(self):
        super().__init__()

        self.renameFormat = None  # type: str
        self.applyTo = None
