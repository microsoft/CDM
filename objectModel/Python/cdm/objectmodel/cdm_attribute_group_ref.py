# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional, Union, TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.utilities import ResolveOptions

from .cdm_attribute_item import CdmAttributeItem
from .cdm_object_ref import CdmObjectReference

if TYPE_CHECKING:
    from cdm.utilities import VisitCallback


class CdmAttributeGroupReference(CdmObjectReference, CdmAttributeItem):
    @property
    def object_type(self) -> 'CdmObjectType':
        return CdmObjectType.ATTRIBUTE_GROUP_REF

    def _copy_ref_object(self, res_opt: 'ResolveOptions', ref_to: Union[str, 'CdmAttributeGroupDefinition'], simple_reference: bool, host: Optional['CdmObjectReference'] = None) -> 'CdmObjectReference':
        if not host:
            # for inline attribute group definition, the owner information is lost here when a ref object created
            # updating it here
            if self.explicit_reference and self.explicit_reference.object_type == CdmObjectType.ATTRIBUTE_GROUP_DEF and not self.explicit_reference.owner:
                self.explicit_reference.owner = self.owner
            return CdmAttributeGroupReference(self.ctx, ref_to, simple_reference)
        else:
            return host._copy_to_host(self.ctx, ref_to, simple_reference)

    def fetch_resolved_entity_references(self, res_opt: Optional['ResolveOptions'] = None) -> 'ResolvedEntityReferenceSet':
        """Deprecated: for internal use only"""

        res_opt = res_opt if res_opt is not None else ResolveOptions(wrt_doc=self, directives=self.ctx.corpus.default_resolution_directives)

        ref = self._fetch_resolved_reference(res_opt)
        if ref:
            return ref.fetch_resolved_entity_references(res_opt)
        if self.explicit_reference:
            return self.explicit_reference.fetch_resolved_entity_references(res_opt)
        return None

    def _visit_ref(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        return False
