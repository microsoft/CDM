from abc import abstractmethod
from typing import TYPE_CHECKING

from .cdm_object import CdmObject
from .cdm_references_entities import CdmReferencesEntities
from .cdm_trait_collection import CdmTraitCollection


class CdmAttributeItem(CdmReferencesEntities, CdmObject):
    @property
    @abstractmethod
    def applied_traits(self) -> 'CdmTraitCollection':
        raise NotImplementedError()
