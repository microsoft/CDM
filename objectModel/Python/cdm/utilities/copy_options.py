# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

from typing import Optional


class CopyOptions:
    def __init__(self, string_refs=None, remove_single_row_localized_table_traits=None) -> None:
        # Turn simple named string object references into objects with a relative path.
        self.string_refs = string_refs  # type: Optional[bool]
        self.remove_single_row_localized_table_traits = remove_single_row_localized_table_traits  # type: Optional[bool]
