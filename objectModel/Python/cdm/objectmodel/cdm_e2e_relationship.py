from typing import Optional, TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.utilities import ResolveOptions

from .cdm_object_def import CdmObjectDefinition

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext
    from cdm.utilities import FriendlyFormatNode, VisitCallback


class CdmE2ERelationship(CdmObjectDefinition):
    def __init__(self, ctx: 'CdmCorpusContext', name: str) -> None:
        super().__init__(ctx)

        self.relationship_name = name  # type: str
        self.from_entity = None  # type: Optional[str]
        self.from_entity_attribute = None  # type: Optional[str]
        self.to_entity = None  # type: Optional[str]
        self.to_entity_attribute = None  # type: Optional[str]

    @property
    def object_type(self) -> 'CdmObjectType':
        return CdmObjectType.E2E_RELATIONSHIP_DEF

    def copy(self, res_opt: Optional['ResolveOptions'] = None) -> 'CdmE2ERelationship':
        res_opt = res_opt if res_opt is not None else ResolveOptions(wrt_doc=self)

        copy = CdmE2ERelationship(self.ctx, self.get_name())
        copy.from_entity = self.from_entity
        copy.from_entity_attribute = self.from_entity_attribute
        copy.to_entity = self.to_entity
        copy.to_entity_attribute = self.to_entity_attribute
        copy.relationship_name = self.relationship_name
        self._copy_def(res_opt, copy)

        return copy

    def get_name(self) -> str:
        return self.relationship_name

    def is_derived_from(self, base: str, res_opt: Optional['ResolveOptions'] = None) -> bool:
        return False

    def validate(self) -> bool:
        return bool(self.from_entity and self.from_entity_attribute and self.to_entity and self.to_entity_attribute)

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        if not self._declared_path:
            self._declared_path = path_from + self.relationship_name

        path = self._declared_path

        if pre_children and pre_children(self, path):
            return False

        if self._visit_def(path, pre_children, post_children):
            return True

        if post_children and post_children(self, path):
            return True

        return False
