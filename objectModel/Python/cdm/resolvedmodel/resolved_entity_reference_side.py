# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

from typing import Optional, TYPE_CHECKING

from cdm.resolvedmodel.resolved_attribute_set_builder import ResolvedAttributeSetBuilder

if TYPE_CHECKING:
    from cdm.objectmodel import CdmEntityDefinition, SpewCatcher
    from cdm.resolvedmodel import ResolvedAttribute
    from cdm.utilities import ResolveOptions


class ResolvedEntityReferenceSide:
    def __init__(self, entity: Optional['CdmEntityDefinition'] = None, rasb: Optional['ResolvedAttributeSetBuilder'] = None) -> None:
        self.entity = entity  # type: Optional[CdmEntityDefinition]
        self.rasb = rasb if rasb else ResolvedAttributeSetBuilder()  # type: ResolvedAttributeSetBuilder

    def get_first_attribute(self) -> Optional['ResolvedAttribute']:
        return self.rasb.ras.set[0] if self.rasb and self.rasb.ras and self.rasb.ras.set else None

    def spew(self, res_opt: 'ResolveOptions', to: 'SpewCatcher', indent: str, name_sort: bool) -> None:
        to.spew_line(indent + ' ent=' + self.entity.entity_name)
        if self.rasb and self.rasb.ras:
            self.rasb.ras.spew(res_opt, to, indent + '  atts:', name_sort)
