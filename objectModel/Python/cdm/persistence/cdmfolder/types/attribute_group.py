from typing import List, Union

from cdm.utilities import JObject


class AttributeGroup(JObject):
    def __init__(self):
        super().__init__()

        self.explanation = ''  # type: str
        self.attributeGroupName = ''  # type: str
        self.attributeContext = ''  # type: str
        self.members = []  # type: List[Union[str, AttributeGroupReference, TypeAttribute, EntityAttribute]]
        self.exhibitsTraits = []  # type: List[Union[str, TraitReference]]
