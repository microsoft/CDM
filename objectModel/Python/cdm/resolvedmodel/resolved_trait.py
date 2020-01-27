# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

from typing import cast, List, Set, TYPE_CHECKING

from cdm.resolvedmodel.parameter_value_set import ParameterValueSet

if TYPE_CHECKING:
    from cdm.objectmodel import CdmArgumentValue, CdmTraitDefinition, SpewCatcher
    from cdm.resolvedmodel import ParameterCollection
    from cdm.utilities import ResolveOptions


class ResolvedTrait:
    def __init__(self, trait: 'CdmTraitDefinition', pc: 'ParameterCollection', values: List['CdmArgumentValue'], was_set: List[bool]) -> None:
        self.trait = trait  # type: CdmTraitDefinition
        self.parameter_values = ParameterValueSet(trait.ctx, pc, values, was_set) if pc and pc.sequence else None  # type: Optional[ParameterValueSet]

    @property
    def trait_name(self) -> str:
        return self.trait._declared_path

    def spew(self, res_opt: 'ResolveOptions', to: 'SpewCatcher', indent: str) -> None:
        to.spew_line(indent + '[' + self.trait_name + ']')
        if self.parameter_values:
            self.parameter_values.spew(res_opt, to, indent + '-')

    def copy(self) -> 'ResolvedTrait':
        if self.parameter_values:
            copy_param_values = self.parameter_values.copy()
            return ResolvedTrait(self.trait, copy_param_values.pc, copy_param_values.values, copy_param_values.was_set)

        return ResolvedTrait(self.trait, None, None, None)

    def collect_trait_names(self, res_opt: 'ResolveOptions', into: Set[str]) -> None:
        # Get the name of this trait and all of its base classes.
        t = self.trait
        while t:
            name = t.trait_name
            into.add(name)
            base_ref = t.extends_trait
            t = cast('CdmTraitDefinition', base_ref.fetch_object_definition(res_opt) if base_ref else None)
