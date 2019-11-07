from typing import Union, List

from cdm.utilities import JObject

from .entity_reference import EntityReference


class ConstantEntity(JObject):
    def __init__(self):
        super().__init__()

        self.explanation = ''  # type: str
        self.constantEntityName = ''  # type: str
        self.entityShape = None  # type: Union[str, EntityReference]
        self.constantValues = []  # type: List[List[str]]
