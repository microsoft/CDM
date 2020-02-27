# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

class RefCounted:
    def __init__(self) -> None:
        self._ref_cnt = 0

    def _add_ref(self) -> None:
        self._ref_cnt += 1

    def _release(self) -> None:
        self._ref_cnt -= 1
