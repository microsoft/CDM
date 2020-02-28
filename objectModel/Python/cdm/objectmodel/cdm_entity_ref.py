# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Union, Optional, TYPE_CHECKING

from cdm.enums import CdmObjectType

from .cdm_object_ref import CdmObjectReference

if TYPE_CHECKING:
    from cdm.objectmodel import CdmConstantEntityDefinition, CdmEntityDefinition
    from cdm.utilities import ResolveOptions, VisitCallback


class CdmEntityReference(CdmObjectReference):
    @property
    def object_type(self) -> 'CdmObjectType':
        return CdmObjectType.ENTITY_REF

    def _copy_ref_object(self, res_opt: 'ResolveOptions', ref_to: Union[str, 'CdmEntityDefinition', 'CdmConstantEntityDefinition'], simple_reference: bool, host: Optional['CdmObjectReference'] = None) -> 'CdmObjectReference':
        if not host:
            return CdmEntityReference(self.ctx, ref_to, simple_reference)

        return host._copy_to_host(self.ctx, ref_to, simple_reference)

    def _visit_ref(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        return False
