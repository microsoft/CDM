from typing import Union

from cdm.utilities import JObject

from .attribute_group import AttributeGroup


class AttributeGroupReference(JObject):
    def __init__(self):
        super().__init__()

        self.attributeGroupReference = None  # type: Union[str, AttributeGroup]
