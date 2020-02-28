# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from cdm.objectmodel import CdmDocumentDefinition


class DocsResult:
    def __init__(self, **kwargs):
        self.new_symbol = kwargs.get('new_symbol', None)  # type: str
        self.doc_best = kwargs.get('doc_best', None)  # type: CdmDocumentDefinition
        self.doc_list = kwargs.get('doc_list', None)  # type: List[CdmDocumentDefinition]
