from typing import Union, List

from .purpose_reference import *
from .trait_reference import TraitReference
from cdm.utilities import JObject


class Purpose(JObject):
    def __init__(self):
        super().__init__()

        self.explanation = ''  # type: str
        self.purposeName = ''  # type: str
        self.extendsPurpose = None  # type: Union[str, PurposeReference]
        self.exhibitsTraits = []  # type: List[Union[str, TraitReference]]
