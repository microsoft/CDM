# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from cdm.utilities.jobject import JObject


class CardinalitySettingsData(JObject):
    """CardinalitySettingsData class"""

    def __init__(self):
        super().__init__()

        self.minimum = None
        self.maximum = None
