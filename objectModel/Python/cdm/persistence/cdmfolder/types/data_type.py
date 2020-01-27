from typing import Union, List

from .data_type_reference import DataTypeReference
from .trait_reference import TraitReference
from cdm.utilities import JObject


class DataType(JObject):
    def __init__(self):
        super().__init__()

        self.explanation = ''  # type: str
        self.dataTypeName = ''  # type: str
        self.extendsDataType = None  # type: Union[str, DataTypeReference]
        self.exhibitsTraits = []  # type: List[Union[str, TraitReference]]
