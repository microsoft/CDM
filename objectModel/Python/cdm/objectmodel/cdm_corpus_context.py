# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

import logging
from typing import Any, cast, Dict, List, Optional, TYPE_CHECKING

from cdm.utilities.resolve_context_scope import ResolveContextScope

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusDefinition, CdmDocumentDefinition


class CdmCorpusContext:
    def __init__(self, corpus: 'CdmCorpusDefinition') -> None:
        self.cache = {}  # type: Dict[str, Any]
        self.corpus = corpus  # type: CdmCorpusDefinition
        self.corpus_path_root = None  # type: Optional[str]
        self.current_doc = None  # type: Optional[CdmDocumentDefinition]
        self.current_scope = None  # type: Optional[ResolveContextScope]
        self.errors = None  # type: Optional[int]
        self.relative_path = None  # type: Optional[str]
        self.scope_stack = []  # type: List[ResolveContextScope]

        self.logger = None  # type: logging.Logger

        self.update_logging_options()

    def fetch_cache(self, for_obj: 'CdmObject', res_opt: 'ResolveOptions', kind: str) -> Any:
        key = self._fetch_cache_key(for_obj, res_opt, kind)
        return self.cache.get(key)

    def pop_scope(self):
        self.scope_stack.pop()
        self.current_scope = self.scope_stack[-1] if self.scope_stack else None

    def push_scope(self, current_trait: Optional['CdmTraitDefinition']) -> None:
        if not self.scope_stack:
            self.scope_stack = []

        current_trait = current_trait if current_trait else (self.current_scope.current_trait if self.current_scope else None)

        ctx_new = ResolveContextScope(current_trait=current_trait, current_parameter=0)
        self.current_scope = ctx_new
        self.scope_stack.append(ctx_new)

    def update_cache(self, for_obj: 'CdmObject', res_opt: 'ResolveOptions', kind: str, value: Any) -> None:
        key = self._fetch_cache_key(for_obj, res_opt, kind)
        self.cache[key] = value

    def update_document_context(self, current_doc: 'CdmDocumentDefinition' = None, corpus_path_root: str = None) -> None:
        if current_doc:
            self.current_doc = cast('CdmDocumentDefinition', current_doc)
        if corpus_path_root:
            self.corpus_path_root = corpus_path_root

    def update_logging_options(self, level=logging.WARNING, handler=None):
        """Configure logger, including level and handler specified by python logging module."""

        self.logger = logging.getLogger('cdm-python')
        self.logger.setLevel(level)

        # Log to console by default if handler is not specified.
        handler = handler or logging.StreamHandler()
        handler.setLevel(self.logger.level)
        handler.setFormatter(logging.Formatter('%(asctime)s\t%(levelname)s\t%(filename)s:%(lineno)s\t%(funcName)s\t%(message)s'))

        self.logger.handlers = [handler]  # Overwrite existing handler.

    def _fetch_cache_key(self, for_obj: 'CdmObject', res_opt: 'ResolveOptions', kind: str) -> str:
        return '{}_{}_{}'.format(for_obj.id, res_opt.wrt_doc.id if res_opt and res_opt.wrt_doc else 'NULL', kind)
