from typing import Union, TYPE_CHECKING

from cdm.enums import CdmObjectType

from .cdm_attribute_item import CdmAttributeItem
from .cdm_trait_collection import CdmTraitCollection
from .cdm_object_def import CdmObjectDefinition

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmTraitDefinition, CdmTraitReference
    from cdm.resolvedmodel import ResolvedTraitSet, ResolvedTraitSetBuilder
    from cdm.utilities import ResolveOptions, VisitCallback


class CdmAttribute(CdmObjectDefinition, CdmAttributeItem):
    def __init__(self, ctx: 'CdmCorpusContext', name: str) -> None:
        super().__init__(ctx)

        # the attribute name.
        self.name = name  # type: str

        # the attribute purpose.
        self.purpose = None  # type: Optional[CdmPurposeReference]

        # properties that guide the resolution of this attribute and interact with directives
        self.resolution_guidance = None  # type: Optional[CdmAttributeResolutionGuidanceDefinition]

        # Internal

        self._applied_traits = CdmTraitCollection(self.ctx, self)

    @property
    def applied_traits(self) -> 'CdmTraitCollection':
        return self._applied_traits

    def _add_resolved_traits_applied(self, rtsb: 'ResolvedTraitSetBuilder', res_opt: 'ResolveOptions') -> 'ResolvedTraitSet':
        def add_applied_traits(ats: 'CdmTraitCollection') -> None:
            if ats:
                for trait in ats:
                    rtsb.merge_traits(trait._fetch_resolved_traits(res_opt))

        add_applied_traits(self.applied_traits)

        # any applied on use
        return rtsb.resolved_trait_set

    def _copy_att(self, res_opt: 'ResolveOptions', copy: 'CdmAttribute') -> 'CdmAttribute':
        copy.purpose = self.purpose.copy(res_opt) if self.purpose else None
        copy.resolution_guidance = self.resolution_guidance.copy(res_opt) if self.resolution_guidance else None
        for trait in self.applied_traits:
            copy.applied_traits.append(trait.copy(res_opt))

        self._copy_def(res_opt, copy)

        return copy

    def get_name(self) -> str:
        return self.name

    def _visit_att(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        if self.purpose and self.purpose.visit('{}/purpose/'.format(path_from), pre_children, post_children):
            return True

        if self.applied_traits and self.applied_traits._visit_array('{}/appliedTraits/'.format(path_from), pre_children, post_children):
            return True

        if self.resolution_guidance and self.resolution_guidance.visit('{}/resolutionGuidance/'.format(path_from), pre_children, post_children):
            return True

        if self._visit_def(path_from, pre_children, post_children):
            return True

        return False
