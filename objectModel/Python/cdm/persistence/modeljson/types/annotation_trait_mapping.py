# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

from cdm.utilities import JObject


class AnnotationTraitMapping(JObject):
    def __init__(self):
        super().__init__()
        self.annotation_name = ''  # type: str
        self.trait_value = ''  # type: str
