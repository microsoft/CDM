from cdm.utilities import JObject


class Import(JObject):
    def __init__(self):
        super().__init__()

        self.corpusPath = ''  # type: str
        self.moniker = ''  # type: str

        self.uri = ''  # type: str
        """DEPRECATED"""
