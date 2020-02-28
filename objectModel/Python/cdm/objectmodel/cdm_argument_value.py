# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Dict, Union

from .cdm_object import CdmObject


CdmArgumentValue = Union[str, Dict, CdmObject]
