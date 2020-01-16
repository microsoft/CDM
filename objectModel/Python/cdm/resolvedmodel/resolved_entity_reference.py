# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

from typing import List, TYPE_CHECKING

from cdm.resolvedmodel.resolved_entity_reference_side import ResolvedEntityReferenceSide

if TYPE_CHECKING:
    from cdm.objectmodel import SpewCatcher
    from cdm.utilities import ResolveOptions


class ResolvedEntityReference:
    def __init__(self) -> None:
        self.referencing = ResolvedEntityReferenceSide()  # type: ResolvedEntityReferenceSide
        self.referenced = []  # type: List[ResolvedEntityReferenceSide]

    def copy(self) -> 'ResolvedEntityReference':
        result = ResolvedEntityReference()
        result.referencing.entity = self.referencing.entity
        result.referencing._rasb = self.referencing._rasb
        result.referenced = [ResolvedEntityReferenceSide(rers.entity, rers._rasb) for rers in self.referenced]
        return result

    def spew(self, res_opt: 'ResolveOptions', to: 'SpewCatcher', indent: str, name_sort: bool) -> None:
        self.referencing.spew(res_opt, to, indent + '(referencing)', name_sort)
        rers = sorted(self.referenced, key=lambda r: r.entity.entity_name.casefold()) if name_sort else self.referenced

        for idx, ent in enumerate(rers):
            ent.spew(res_opt, to, indent + '(referenced[' + str(idx) + '])', name_sort)
