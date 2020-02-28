# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Union, Optional, TYPE_CHECKING

from cdm.enums import CdmObjectType

from .cdm_object_ref import CdmObjectReference

if TYPE_CHECKING:
    from cdm.objectmodel import CdmDataTypeDefinition
    from cdm.utilities import FriendlyFormatNode, ResolveOptions, VisitCallback


class CdmDataTypeReference(CdmObjectReference):
    @property
    def object_type(self) -> 'CdmObjectType':
        return CdmObjectType.DATA_TYPE_REF

    def _copy_ref_object(self, res_opt: 'ResolveOptions', ref_to: Union[str, 'CdmDataTypeDefinition'], simple_reference: bool, host: Optional['CdmObjectReference'] = None) -> 'CdmObjectReference':
        if not host:
            return CdmDataTypeReference(self.ctx, ref_to, simple_reference)
        else:
            return host._copy_to_host(self.ctx, ref_to, simple_reference)

    def _visit_ref(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        return False
