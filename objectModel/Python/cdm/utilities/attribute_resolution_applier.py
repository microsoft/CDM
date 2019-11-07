# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

from typing import Callable, Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from cdm.objectmodel import CdmAttributeResolutionGuidanceDefinition
    from cdm.utilities import ApplierContext, ResolveOptions


class AttributeResolutionApplier:

    def __init__(self) -> None:
        self.match_name = None  # type: Optional[str]
        self.priority = 0  # type: int

        self.overrides_base = False  # type: bool
        self.will_alter_directives = None  # type: Optional[Callable[[ResolveOptions, CdmAttributeResolutionGuidanceDefinition], bool]]
        self.do_alter_directives = None  # type: Optional[Callable[[ResolveOptions, CdmAttributeResolutionGuidanceDefinition], None]]
        self.will_create_context = None  # type: Optional[Callable[[ApplierContext], bool]]
        self.do_create_context = None  # type: Optional[Callable[[ApplierContext], None]]
        self.will_remove = None  # type: Optional[Callable[[ApplierContext], bool]]
        self.will_attribute_modify = None  # type: Optional[Callable[[ApplierContext], bool]]
        self.do_attribute_modify = None  # type: Optional[Callable[[ApplierContext], None]]
        self.will_group_add = None  # type: Optional[Callable[[ApplierContext], bool]]
        self.do_group_add = None  # type: Optional[Callable[[ApplierContext], None]]
        self.will_round_add = None  # type: Optional[Callable[[ApplierContext], bool]]
        self.do_round_add = None  # type: Optional[Callable[[ApplierContext], None]]
        self.will_attribute_add = None  # type: Optional[Callable[[ApplierContext], bool]]
        self.do_attribute_add = None  # type: Optional[Callable[[ApplierContext], None]]
