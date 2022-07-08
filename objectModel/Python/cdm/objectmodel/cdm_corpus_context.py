# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Any, Dict, List, Optional, TYPE_CHECKING

from cdm.enums import CdmStatusLevel
from cdm.utilities import EventCallback
from cdm.utilities.logging.event_list import EventList

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusDefinition, CdmDocumentDefinition
    from cdm.resolvedmodel import ResolvedAttributeSetBuilder, ResolvedTraitSet


class CdmCorpusContext:
    def __init__(self, corpus: 'CdmCorpusDefinition', status_event: 'EventCallback', \
                    report_at_level: Optional['CdmStatusLevel'] = None, \
                    correlation_id: Optional[str] = None) -> None:
        self.corpus = corpus  # type: CdmCorpusDefinition
        self.report_at_level = report_at_level or CdmStatusLevel.WARNING  # type: CdmStatusLevel
        self.status_event = status_event  # type: EventCallback
        self.events = EventList() # type: EventList
        self.suppressed_log_codes = set() # type: set
        self.feature_flags = {} # type: Dict[str, object]

        self.correlation_id = correlation_id or None # type: Optional[str]

        # --- internal ---
        self._attribute_cache = {}  # type: Dict[str, ResolvedAttributeSetBuilder]
        self._trait_cache = {}  # type: Dict[str, ResolvedTraitSet]
        self._relative_path = None  # type: Optional[str]
