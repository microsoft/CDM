# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import List, Optional

from cdm.utilities import JObject

from cdm.persistence.cdmfolder.types.entity_reference import EntityReference
from cdm.persistence.cdmfolder.types.projections.operation_base import OperationBase


class Projection(JObject):
    """Projection class"""

    def __init__(self):
        super().__init__()

        self.explanation = None  # type: str
        self.condition = None  # type: str
        self.operations = None  # type: List[OperationBase]
        self.runSequentially = None  # type: Optional[bool]
        self.source = None  # type: Union[str, EntityReference, Projection]
