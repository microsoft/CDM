# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Any, Dict, List, Optional, TYPE_CHECKING

from cdm.enums import CdmStatusLevel
from cdm.utilities import EventCallback, ResolveContextScope
from cdm.utilities.logging.event_list import EventList

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusDefinition, CdmDocumentDefinition


class CdmCorpusContext:
    def __init__(self, corpus: 'CdmCorpusDefinition', status_event: 'EventCallback', \
                    report_at_level: Optional['CdmStatusLevel'] = None, \
                    correlation_id: Optional[str] = None) -> None:
        self.corpus = corpus  # type: CdmCorpusDefinition
        self.report_at_level = report_at_level or CdmStatusLevel.WARNING  # type: CdmStatusLevel
        self.status_event = status_event  # type: EventCallback
        self.events = EventList() # type: EventList
        self.suppressed_log_codes = set() # type: set

        self.correlation_id = correlation_id or None # type: Optional[str]

        # --- internal ---
        self._cache = {}  # type: Dict[str, Any]
        self._current_scope = None  # type: Optional[ResolveContextScope]
        self._relative_path = None  # type: Optional[str]
        self._scope_stack = []  # type: List[ResolveContextScope]

    def fetch_cache(self, for_obj: 'CdmObject', res_opt: 'ResolveOptions', kind: str) -> Any:
        key = self._fetch_cache_key(for_obj, res_opt, kind)
        return self._cache.get(key)

    def pop_scope(self):
        self._scope_stack.pop()
        self._current_scope = self._scope_stack[-1] if self._scope_stack else None

    def push_scope(self, current_trait: 'CdmTraitDefinition') -> None:
        if not self._scope_stack:
            self._scope_stack = []

        current_trait = current_trait if current_trait else (self._current_scope._current_trait if self._current_scope else None)

        ctx_new = ResolveContextScope(current_trait=current_trait, current_parameter=0)
        self._current_scope = ctx_new
        self._scope_stack.append(ctx_new)

    def update_cache(self, for_obj: 'CdmObject', res_opt: 'ResolveOptions', kind: str, value: Any) -> None:
        key = self._fetch_cache_key(for_obj, res_opt, kind)
        self._cache[key] = value

    def _fetch_cache_key(self, for_obj: 'CdmObject', res_opt: 'ResolveOptions', kind: str) -> str:
        return '{}_{}_{}'.format(for_obj.id, res_opt.wrt_doc.id if res_opt and res_opt.wrt_doc else 'NULL', kind)
