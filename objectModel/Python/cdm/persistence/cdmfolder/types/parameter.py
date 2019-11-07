from typing import Union

from .data_type_reference import DataTypeReference
from cdm.utilities import JObject


class Parameter(JObject):
    def __init__(self):
        super().__init__()

        self.explanation = ''  # type: str
        self.name = ''  # type: str
        self.defaultValue = None  # type: CdmJsonType
        self.required = False  # type: bool
        self.dataType = None  # type: Union[str, DataTypeReference]
