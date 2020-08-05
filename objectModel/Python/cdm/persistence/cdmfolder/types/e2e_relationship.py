# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from cdm.utilities import JObject


class E2ERelationship(JObject):
    def __init__(self):
        super().__init__()

        self.name = None  # type: str
        self.fromEntity = None  # type: str
        self.fromEntityAttribute = None  # type: str
        self.toEntity = None  # type: str
        self.toEntityAttribute = None  # type: str
