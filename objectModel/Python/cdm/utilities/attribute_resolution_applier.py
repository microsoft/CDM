# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Callable, Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from cdm.objectmodel import CdmAttributeResolutionGuidanceDefinition
    from cdm.utilities import ApplierContext, ResolveOptions


class AttributeResolutionApplier:

    def __init__(self) -> None:
        self._match_name = None  # type: Optional[str]
        self._priority = 0  # type: int

        self._overrides_base = False  # type: bool
        self._will_alter_directives = None  # type: Optional[Callable[[ResolveOptions, CdmAttributeResolutionGuidanceDefinition], bool]]
        self._do_alter_directives = None  # type: Optional[Callable[[ResolveOptions, CdmAttributeResolutionGuidanceDefinition], None]]
        self._will_create_context = None  # type: Optional[Callable[[ApplierContext], bool]]
        self._do_create_context = None  # type: Optional[Callable[[ApplierContext], None]]
        self._will_remove = None  # type: Optional[Callable[[ApplierContext], bool]]
        self._will_attribute_modify = None  # type: Optional[Callable[[ApplierContext], bool]]
        self._do_attribute_modify = None  # type: Optional[Callable[[ApplierContext], None]]
        self._will_group_add = None  # type: Optional[Callable[[ApplierContext], bool]]
        self._do_group_add = None  # type: Optional[Callable[[ApplierContext], None]]
        self._will_round_add = None  # type: Optional[Callable[[ApplierContext], bool]]
        self._do_round_add = None  # type: Optional[Callable[[ApplierContext], None]]
        self._will_attribute_add = None  # type: Optional[Callable[[ApplierContext], bool]]
        self._do_attribute_add = None  # type: Optional[Callable[[ApplierContext], None]]
