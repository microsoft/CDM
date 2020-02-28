# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Callable, TYPE_CHECKING

if TYPE_CHECKING:
    from cdm.enums import CdmStatusLevel


EventCallback = Callable[['CdmStatusLevel', str], None]
