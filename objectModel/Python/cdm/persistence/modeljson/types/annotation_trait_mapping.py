# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from cdm.utilities import JObject


class AnnotationTraitMapping(JObject):
    def __init__(self):
        super().__init__()
        self.annotation_name = ''  # type: str
        self.trait_value = ''  # type: str
