# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

from typing import List, Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from cdm.objectmodel import CdmEntityDefinition, SpewCatcher
    from cdm.resolvedmodel import ResolvedEntityReference
    from cdm.utilities import ResolveOptions


class ResolvedEntityReferenceSet:
    def __init__(self, res_opt: 'ResolveOptions', rer_set: List['ResolvedEntityReference'] = None) -> None:
        self.res_opt = res_opt  # type: ResolveOptions
        self.rer_set = rer_set or []  # type: List[ResolvedEntityReference]

    def add(self, to_add: 'ResolvedEntityReferenceSet') -> None:
        if to_add and to_add.rer_set:
            self.rer_set += to_add.rer_set

    def copy(self) -> 'ResolvedEntityReferenceSet':
        return ResolvedEntityReferenceSet(self.res_opt, [rer.copy() for rer in self.rer_set])

    def find_entity(self, ent_other: 'CdmEntityDefinition') -> Optional['ResolvedEntityReferenceSet']:
        # Make an array of just the refs that include the requested.
        filtered_set = [rer for rer in self.rer_set if any(rers.entity == ent_other for rers in rer.referenced)]
        return None if filtered_set else ResolvedEntityReferenceSet(self.res_opt, filtered_set)

    def spew(self, res_opt: 'ResolveOptions', to: 'SpewCatcher', indent: str, name_sort: bool) -> None:
        if name_sort:
            rer_list = sorted(
                self.rer_set,
                key=lambda rer: rer.referenced[0].entity.entity_name.casefold() if rer and rer.referenced else '')
        else:
            rer_list = self.rer_set

        for idx, rer in enumerate(rer_list):
            rer.spew(res_opt, to, indent + '(rer[' + str(idx) + '])', name_sort)
