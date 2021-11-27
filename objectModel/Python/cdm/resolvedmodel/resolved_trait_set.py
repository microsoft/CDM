# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import cast, Dict, List, Optional, Set, TYPE_CHECKING

from cdm.resolvedmodel.parameter_value import ParameterValue

if TYPE_CHECKING:
    from cdm.objectmodel import CdmArgumentValue, CdmArgumentDefinition, CdmTraitDefinition, SpewCatcher
    from cdm.resolvedmodel import ResolvedTrait
    from cdm.utilities import ResolveOptions


class ResolvedTraitSet:
    def __init__(self, res_opt: 'ResolveOptions') -> None:
        from cdm.objectmodel import CdmObject

        self.res_opt = res_opt  # type: ResolveOptions
        self.rt_set = []  # type: List[ResolvedTrait]
        self.lookup_by_trait = {}  # type: Dict[CdmTraitDefinition, ResolvedTrait]
        self.has_elevated = False  # type: bool

    @property
    def size(self) -> int:
        return len(self.rt_set or [])

    @property
    def first(self) -> Optional['ResolvedTrait']:
        return self.rt_set[0] if self.rt_set else None

    def merge(self, to_merge: 'ResolvedTrait', copy_on_write: bool) -> 'ResolvedTraitSet':
        trait_set_result = self
        trait = to_merge.trait
        av = to_merge.parameter_values.values if to_merge.parameter_values else None
        was_set = to_merge.parameter_values.was_set if to_merge.parameter_values else None

        if not self.has_elevated:
            self.has_elevated = trait.elevated

        if trait in trait_set_result.lookup_by_trait:
            rt_old = trait_set_result.lookup_by_trait[trait]
            av_old = rt_old.parameter_values.values if rt_old.parameter_values else None

            if av and av_old:
                # The new values take precedence.
                for i in range(len(av)):  # pylint: disable=consider-using-enumerate
                    if av[i] != av_old[i]:
                        if copy_on_write:
                            trait_set_result = trait_set_result.shallow_copy_with_exception(trait)
                            rt_old = trait_set_result.lookup_by_trait[trait]
                            av_old = rt_old.parameter_values.values
                            copy_on_write = False

                        av_old[i] = ParameterValue.fetch_replacement_value(self.res_opt, av_old[i], av[i], was_set[i])
        else:
            if copy_on_write:
                trait_set_result = trait_set_result.shallow_copy()

            to_merge = to_merge.copy()
            trait_set_result.rt_set.append(to_merge)
            trait_set_result.lookup_by_trait[trait] = to_merge

        return trait_set_result

    def merge_set(self, to_merge: 'ResolvedTraitSet', elevated_only: bool = False) -> 'ResolvedTraitSet':
        copy_on_write = True
        trait_set_result = self

        if to_merge:
            for rt in to_merge.rt_set:
                if not elevated_only or rt.trait.elevated:
                    trait_set_merge = trait_set_result.merge(rt, copy_on_write)
                    if trait_set_merge != trait_set_result:
                        trait_set_result = trait_set_merge
                        copy_on_write = False

        return trait_set_result

    def get(self, trait: 'CdmTraitDefinition') -> Optional['ResolvedTrait']:
        return self.lookup_by_trait.get(trait, None)

    def find(self, res_opt: 'ResolveOptions', trait_name: str) -> Optional['ResolvedTrait']:
        for rt in self.rt_set:
            if rt.trait.is_derived_from(trait_name, res_opt):
                return rt

        return None

    def remove(self, res_opt: 'ResolveOptions', trait_name: str) -> bool:
        rt = self.find(res_opt, trait_name)
        if rt is not None:
            self.lookup_by_trait.pop(rt.trait)
            self.rt_set.remove(rt)
            return True

        return False

    def deep_copy(self) -> 'ResolvedTraitSet':
        copy = ResolvedTraitSet(self.res_opt)

        for rt in self.rt_set:
            rt_copy = rt.copy()
            copy.rt_set.append(rt_copy)
            copy.lookup_by_trait[rt.trait] = rt_copy

        copy.has_elevated = self.has_elevated
        return copy

    def shallow_copy_with_exception(self, just: 'CdmTraitDefinition') -> 'ResolvedTraitSet':
        copy = ResolvedTraitSet(self.res_opt)

        for rt in self.rt_set:
            rt_copy = rt.copy() if rt.trait == just else rt
            copy.rt_set.append(rt_copy)
            copy.lookup_by_trait[rt.trait] = rt_copy

        copy.has_elevated = self.has_elevated
        return copy

    def shallow_copy(self) -> 'ResolvedTraitSet':
        copy = ResolvedTraitSet(self.res_opt)

        if self.rt_set:
            for rt in self.rt_set:
                copy.rt_set.append(rt)
                copy.lookup_by_trait[rt.trait] = rt

        copy.has_elevated = self.has_elevated
        return copy

    def collect_trait_names(self) -> Set[str]:
        collection = set()  # type: Set[str]
        if self.rt_set:
            for rt in self.rt_set:
                rt.collect_trait_names(self.res_opt, collection)

        return collection

    def set_parameter_value_from_argument(self, trait: 'CdmTraitDefinition', arg: 'CdmArgumentDefinition') -> None:
        res_trait = self.get(trait)
        if res_trait and res_trait.parameter_values:
            av = res_trait.parameter_values.values
            new_val = arg.value
            # Get the value index from the parameter collection given the parameter that this argument is setting.
            param_def = arg._get_parameter_def()
            if param_def is not None:
                res_trait.parameter_values.update_parameter_value(self.res_opt, param_def.get_name(), new_val)
            else:
                # debug
                param_def = arg._get_parameter_def()

    def set_trait_parameter_value(self, res_opt: 'ResolveOptions', to_trait: 'CdmTraitDefinition',  # pylint: disable=unused-argument
                                  param_name: str, value: 'CdmArgumentValue') -> 'ResolvedTraitSet':
        altered = self.shallow_copy_with_exception(to_trait)
        curr_trait = altered.get(to_trait)
        if curr_trait:
            curr_trait.parameter_values.update_parameter_value(self.res_opt, param_name, value)
        return altered

    def replace_trait_parameter_value(self, res_opt: 'ResolveOptions', to_trait: str,  # pylint: disable=unused-argument
                                      param_name: str, value_when: 'CdmArgumentValue', value_new: 'CdmArgumentValue'
                                      ) -> 'ResolvedTraitSet':
        trait_set_result = cast('ResolvedTraitSet', self)

        for idx_rt, rt in enumerate(trait_set_result.rt_set):
            if rt.trait.is_derived_from(to_trait, self.res_opt) and rt.parameter_values:
                av = rt.parameter_values.values
                idx = rt.parameter_values.pc.fetch_parameter_index(param_name)
                if idx is not None and av[idx] == value_when:
                    # Copy the set and make a deep copy of the trait being set.
                    trait_set_result = self.shallow_copy_with_exception(rt.trait)
                    # Assume these are all still True for this copy.
                    rt = trait_set_result.rt_set[idx_rt]
                    av = rt.parameter_values.values
                    av[idx] = ParameterValue.fetch_replacement_value(self.res_opt, av[idx], value_new, True)
                    break

        return trait_set_result

    def spew(self, res_opt: 'ResolveOptions', to: 'SpewCatcher', indent: str, name_sort: bool) -> None:
        new_set = self.rt_set if not name_sort else sorted(self.rt_set, key=lambda rt: rt.trait_name.casefold())
        for rt in new_set:
            # Comment this line to simplify spew results to stop at attribute names.
            rt.spew(res_opt, to, indent)
