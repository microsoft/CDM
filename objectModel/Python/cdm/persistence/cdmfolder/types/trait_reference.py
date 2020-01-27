from typing import Union, List, Optional

from cdm.utilities import JObject


class TraitReference(JObject):
    def __init__(self):
        super().__init__()

        self.traitReference = None  # type: Union[str, Trait]
        self.arguments = []  # type: Optional[List[Union[str, Argument]]]
