from typing import Optional, TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.utilities import ResolveOptions

from .cdm_object_def import CdmObjectDefinition

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmDataTypeReference
    from cdm.resolvedmodel import ResolvedTraitSetBuilder
    from cdm.utilities import FriendlyFormatNode, VisitCallback


class CdmDataTypeDefinition(CdmObjectDefinition):
    def __init__(self, ctx: 'CdmCorpusContext', data_type_name: str, extends_data_type: Optional['CdmDataTypeReference']) -> None:
        super().__init__(ctx)

        # the data type name.
        self.data_type_name = data_type_name  # type: str

        # the data type extended by this data type.
        self.extends_data_type = extends_data_type  # type: Optional[CdmDataTypeReference]

        self._declared_path = None  # type: Optional[str]

    @property
    def object_type(self) -> 'CdmObjectType':
        return CdmObjectType.DATA_TYPE_DEF

    def _construct_resolved_traits(self, rtsb: 'ResolvedTraitSetBuilder', res_opt: 'ResolveOptions') -> None:
        self._construct_resolved_traits_def(self.extends_data_type, rtsb, res_opt)

    def copy(self, res_opt: Optional['ResolveOptions'] = None) -> 'CdmDataTypeDefinition':
        res_opt = res_opt if res_opt is not None else ResolveOptions(wrt_doc=self)

        copy = CdmDataTypeDefinition(self.ctx, self.data_type_name, None)
        copy.extends_data_type = self.extends_data_type.copy(res_opt) if self.extends_data_type else None
        self._copy_def(res_opt, copy)
        return copy

    def validate(self) -> bool:
        return bool(self.data_type_name)

    def get_name(self) -> str:
        return self.data_type_name

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        path = self._declared_path

        if not path:
            path = path_from + self.data_type_name
            self._declared_path = path

        if pre_children and pre_children(self, path):
            return False

        if self.extends_data_type and self.extends_data_type.visit('{}/extendsDataType/'.format(path), pre_children, post_children):
            return True

        if self._visit_def(path, pre_children, post_children):
            return True

        if post_children and post_children(self, path):
            return True

        return False

    def is_derived_from(self, base: str, res_opt: Optional['ResolveOptions'] = None) -> bool:
        return self._is_derived_from_def(res_opt, self.extends_data_type, self.get_name(), base)
