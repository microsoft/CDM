# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import List, TYPE_CHECKING

from .parameter_value import ParameterValue

if TYPE_CHECKING:
    from cdm.objectmodel import CdmArgumentValue, CdmCorpusContext, CdmParameterDefinition, SpewCatcher
    from cdm.resolvedmodel import ParameterCollection
    from cdm.utilities import ResolveOptions


class ParameterValueSet():
    def __init__(self, ctx: 'CdmCorpusContext', pc: 'ParameterCollection', values: 'List[CdmArgumentValue]', was_set: 'List[bool]') -> None:
        self.ctx = ctx  # type:CdmCorpusContext
        self.pc = pc  # type: ParameterCollection
        self.values = values  # type: List[CdmArgumentValue]
        self.was_set = was_set  # type: List[bool]

    @property
    def length(self) -> int:
        return 0 if self.pc is None else len(self.pc.sequence)

    def index_of(self, param_def: 'CdmParameterDefinition') -> int:
        return self.pc.ordinals[param_def]

    def fetch_parameter_at_index(self, idx: int) -> 'CdmParameterDefinition':
        return self.pc.sequence[idx]

    def fetch_value(self, idx: int) -> 'CdmArgumentValue':
        return self.values[idx]

    def fetch_value_string(self, res_opt: 'ResolveOptions', idx: int) -> str:
        return ParameterValue(self.ctx, self.pc.sequence[idx], self.values[idx]).fetch_value_string(res_opt)

    def fetch_parameter_value(self, param_name: str) -> 'ParameterValue':
        idx = self.pc.fetch_parameter_index(param_name)
        return ParameterValue(self.ctx, self.pc.sequence[idx], self.values[idx])

    def update_parameter_value(self, res_opt: 'ResolveOptions', param_name: str, value: 'CdmArgumentValue') -> None:
        idx = self.pc.fetch_parameter_index(param_name)
        self.values[idx] = ParameterValue.fetch_replacement_value(res_opt, self.values[idx], value, True)
        self.was_set[idx] = True

    def copy(self) -> 'ParameterValueSet':
        return ParameterValueSet(self.ctx, self.pc, self.values.copy(), self.was_set.copy())

    def spew(self, res_opt: 'ResolveOptions', to: 'SpewCatcher', indent: str) -> None:
        for idx in range(self.length):
            pv = ParameterValue(self.ctx, self.pc.sequence[idx], self.values[idx])
            pv.spew(res_opt, to, indent + '-')
