# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from abc import ABC, abstractmethod


class SpewCatcher(ABC):

    @abstractmethod
    def clear(self) -> None:
        raise NotImplementedError()

    def spew_line(self, spew: str) -> None:
        raise NotImplementedError()
