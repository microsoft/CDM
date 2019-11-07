from abc import ABC, abstractmethod
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from cdm.resolvedmodel import ResolvedEntityReferenceSet
    from cdm.utilities import ResolveOptions


class CdmReferencesEntities(ABC):
    @abstractmethod
    def fetch_resolved_entity_references(self, res_opt: 'ResolveOptions') -> 'ResolvedEntityReferenceSet':
        raise NotImplementedError()
