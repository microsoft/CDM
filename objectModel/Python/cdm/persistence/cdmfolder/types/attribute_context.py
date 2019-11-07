from typing import List

from cdm.utilities import JObject


class AttributeContext(JObject):
    def __init__(self):
        super().__init__()

        self.explanation = ''  # type: str
        self.type = ''  # type: str
        self.name = ''  # type: str
        self.parent = ''  # type: str
        self.definition = ''  # type: str
        self.appliedTraits = []  # type: Optional[List[str, TraitRefernce]]
        self.contents = []  # type: Optional[List[str, AttributeContext]]
