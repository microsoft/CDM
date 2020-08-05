# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from cdm.utilities import JObject


class OperationBase(JObject):
    """OperationBase class"""

    def __init__(self):
        super().__init__()

        self.json_rename({
            "type": "$type"
        })

        self.json_sort({"type": -2})

        self.type = None  # type: str
        self.explanation = None  # type: str
