# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Dict, List, TYPE_CHECKING

if TYPE_CHECKING:
    from cdm.objectmodel import CdmParameterDefinition


class ParameterCollection:
    def __init__(self, prior: 'ParameterCollection'):
        self.sequence = [] if prior is None or prior.sequence is None else prior.sequence.copy()  # type: List[CdmParameterDefinition]
        self.lookup = {} if prior is None or prior.lookup is None else prior.lookup.copy()  # type: Dict[str, CdmParameterDefinition]
        self.ordinals = {} if prior is None or prior.ordinals is None else prior.ordinals.copy()  # type: Dict[CdmParameterDefinition, int]

    def add(self, element: 'CdmParameterDefinition') -> None:
        name = element.name
        if name:
            if name in self.lookup:
                # why not just replace the old one?
                self.lookup[name] = element
                self.sequence[self.sequence.index(next(filter(lambda x: x.name == name, self.sequence), None))] = element
                self.ordinals[element] = len(self.sequence)
            self.lookup[name] = element

        self.ordinals[element] = len(self.sequence)
        self.sequence.append(element)

    def resolve_parameter(self, ordinal: int, name: str) -> 'CdmParameterDefinition':
        if name:
            if name not in self.lookup:
                raise ValueError('There is no parameter named {}'.format(name))
            return self.lookup[name]

        if ordinal >= len(self.sequence):
            raise ValueError('Too many arguments supplied')

        return self.sequence[ordinal]

    def fetch_parameter_index(self, param_name: str) -> int:
        return self.ordinals[self.lookup[param_name]]
