from cdm.utilities import JObject


class E2ERelationship(JObject):
    def __init__(self):
        super().__init__()

        self.fromEntity = ''  # type: str
        self.fromEntityAttribute = ''  # type: str
        self.toEntity = ''  # type: str
        self.toEntityAttribute = ''  # type: str
