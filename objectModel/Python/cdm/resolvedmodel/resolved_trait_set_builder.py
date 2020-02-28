# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional, TYPE_CHECKING

from cdm.resolvedmodel.resolved_trait_set import ResolvedTraitSet

if TYPE_CHECKING:
    from cdm.objectmodel import CdmArgumentValue, CdmTraitDefinition
    from cdm.resolvedmodel import ResolvedTrait
    from cdm.utilities import ResolveOptions


class ResolvedTraitSetBuilder:
    def __init__(self):
        self.resolved_trait_set = None  # type: Optional[ResolvedTraitSet]

    def clear(self) -> None:
        self.resolved_trait_set = None

    def merge_traits(self, rts_new: 'ResolvedTraitSet') -> None:
        if rts_new:
            if not self.resolved_trait_set:
                self.resolved_trait_set = ResolvedTraitSet(rts_new.res_opt)
            self.resolved_trait_set = self.resolved_trait_set.merge_set(rts_new)

    def take_reference(self, rts_new: 'ResolvedTraitSet') -> None:
        self.resolved_trait_set = rts_new

    def own_one(self, rt: 'ResolvedTrait', res_opt: 'ResolveOptions') -> None:
        self.resolved_trait_set = ResolvedTraitSet(res_opt)
        self.resolved_trait_set.merge(rt, False)

    def set_trait_parameter_value(self, res_opt: 'ResolveOptions', to_trait: 'CdmTraitDefinition', param_name: str,
                                  value: 'CdmArgumentValue') -> None:
        self.resolved_trait_set = self.resolved_trait_set.set_trait_parameter_value(res_opt, to_trait, param_name, value)

    def replace_trait_parameter_value(self, res_opt: 'ResolveOptions', to_trait: str, param_name: str,
                                      value_when: 'CdmArgumentValue', value_new: 'CdmArgumentValue') -> None:
        if self.resolved_trait_set:
            self.resolved_trait_set = self.resolved_trait_set.replace_trait_parameter_value(res_opt, to_trait, param_name, value_when, value_new)
