# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

class TypeAttributeParam:
    """Type Attribute Test Parameters"""

    def __init__(self, name: str, data_type: str, purpose: str):
        self._attribute_name = name  # type: str
        self._attribute_data_type = data_type  # type: str
        self._attribute_purpose = purpose  # type: str

    # Attribute name property
    def get_attribute_name(self) -> str:
        return self._attribute_name

    def set_attribute_name(self, name: str) -> None:
        self._attribute_name = name

    # Attribute datatype property
    def get_attribute_data_type(self) -> str:
        return self._attribute_data_type

    def set_attribute_data_type(self, data_type: str) -> None:
        self._attribute_data_type = data_type

    # Attribute purpose property
    def get_attribute_purpose(self) -> str:
        return self._attribute_purpose

    def set_attribute_purpose(self, purpose: str) -> None:
        self._attribute_purpose = purpose

