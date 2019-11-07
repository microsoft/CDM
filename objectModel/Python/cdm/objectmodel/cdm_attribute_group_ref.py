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

    def _copy_ref_object(self, res_opt: 'ResolveOptions', ref_to: Union[str, 'CdmAttributeGroupReference'], simple_reference: bool) -> 'CdmObjectReference':
        return CdmAttributeGroupReference(self.ctx, ref_to, simple_reference)

    def fetch_resolved_entity_references(self, res_opt: Optional['ResolveOptions'] = None) -> 'ResolvedEntityReferenceSet':
        res_opt = res_opt if res_opt is not None else ResolveOptions(wrt_doc=self)

        ref = self._fetch_resolved_reference(res_opt)
        if ref:
            return ref.fetch_resolved_entity_references(res_opt)
        if self.explicit_reference:
            return self.explicit_reference.fetch_resolved_entity_references(res_opt)
        return None

    def _visit_ref(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        return False
