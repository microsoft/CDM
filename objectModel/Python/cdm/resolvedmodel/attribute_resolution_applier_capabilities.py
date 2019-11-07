# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------


class AttributeResolutionApplierCapabilities:

    def __init__(self, caps: 'AttributeResolutionApplierCapabilities' = None) -> None:
        self.can_alter_directives = caps.can_alter_directives if caps else False  # type: bool
        self.can_create_context = caps.can_create_context if caps else False  # type: bool
        self.can_remove = caps.can_remove if caps else False  # type: bool
        self.can_attribute_modify = caps.can_attribute_modify if caps else False  # type: bool
        self.can_group_add = caps.can_group_add if caps else False  # type: bool
        self.can_round_add = caps.can_round_add if caps else False  # type: bool
        self.can_attribute_add = caps.can_attribute_add if caps else False  # type: bool
