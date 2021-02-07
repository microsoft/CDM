# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional

from cdm.utilities import JObject


class OperationBase(JObject):
    """OperationBase class"""

    def __init__(self):
        super().__init__()

        self.json_rename({
            "type": "$type"
        })

        self.json_sort({"type": -2})

        self.condition = None  # type: Optional[bool]
        self.explanation = None  # type: str
        self.sourceInput = None  # type: Optional[bool]
        self.type = None  # type: str

