# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from cdm.objectmodel import CdmAttributeContext, CdmObject
    from cdm.enums import CdmAttributeContextType


class AttributeContextParameters:
    """Describe new attribute context into which a set of resolved attributes should be placed."""

    def __init__(self, **kwargs) -> None:
        self.name = kwargs.get('name', None)  # type: str
        self.include_traits = kwargs.get('include_traits', False)  # type: bool
        self.under = kwargs.get('under', None)  # type: CdmAttributeContext
        self.type = kwargs.get('type', None)  # type: CdmAttributeContextType
        self.regarding = kwargs.get('regarding', None)  # type: CdmObject
