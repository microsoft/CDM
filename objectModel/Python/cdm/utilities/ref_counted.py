# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------


class RefCounted:
    def __init__(self) -> None:
        self.ref_cnt = 0

    def add_ref(self) -> None:
        self.ref_cnt += 1

    def release(self) -> None:
        self.ref_cnt -= 1
