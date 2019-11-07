from typing import Union, List

from cdm.utilities import JObject
from .data_type import *
from .trait_reference import TraitReference


class DataTypeReference(JObject):
    def __init__(self):
        super().__init__()

        self.dataTypeReference = None  # type: Union[str, DataType]
        self.appliedTraits = []  # type: List[Union[str, TraitReference]]
