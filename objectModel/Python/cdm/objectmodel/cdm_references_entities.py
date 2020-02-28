# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from abc import ABC, abstractmethod
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from cdm.resolvedmodel import ResolvedEntityReferenceSet
    from cdm.utilities import ResolveOptions


class CdmReferencesEntities(ABC):
    @abstractmethod
    def fetch_resolved_entity_references(self, res_opt: 'ResolveOptions') -> 'ResolvedEntityReferenceSet':
        raise NotImplementedError()
