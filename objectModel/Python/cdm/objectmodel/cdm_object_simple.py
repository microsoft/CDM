# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional, TYPE_CHECKING

from .cdm_object import CdmObject

if TYPE_CHECKING:
    from cdm.objectmodel import CdmObjectDefinition, CdmObjectReference
    from cdm.utilities import ResolveOptions


class CdmObjectSimple(CdmObject):
    def create_simple_reference(self, res_opt: 'ResolveOptions') -> Optional['CdmObjectReference']:
        return None

    def fetch_object_definition(self, res_opt: 'ResolveOptions') -> Optional['CdmObjectDefinition']:
        """Returns the resolved object reference."""
        return None

    def fetch_object_definition_name(self) -> Optional[str]:
        return None

    def is_derived_from(self, base: str, res_opt: Optional['ResolveOptions'] = None) -> bool:
        return False
