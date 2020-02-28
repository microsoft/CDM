# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from cdm.objectmodel import CdmAttributeContext, CdmObject
    from cdm.enums import CdmAttributeContextType


class AttributeContextParameters:
    """Describe new attribute context into which a set of resolved attributes should be placed."""

    def __init__(self, **kwargs) -> None:
        self._name = kwargs.get('name', None)  # type: str
        self._include_traits = kwargs.get('include_traits', False)  # type: bool
        self._under = kwargs.get('under', None)  # type: CdmAttributeContext
        self._type = kwargs.get('type', None)  # type: CdmAttributeContextType
        self._regarding = kwargs.get('regarding', None)  # type: CdmObject
