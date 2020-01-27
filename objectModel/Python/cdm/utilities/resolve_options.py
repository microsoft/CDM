# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from cdm.objectmodel import CdmDocumentDefinition

    from . import AttributeResolutionDirectiveSet


class ResolveOptions:
    def __init__(self, wrt_doc: Optional['CdmDocumentDefinition'] = None, directives: Optional['AttributeResolutionDirectiveSet'] = None) -> None:
        from . import AttributeResolutionDirectiveSet, SymbolSet

        # Document to use as a point of reference when resolving relative paths and symbol names.
        self.wrt_doc = wrt_doc  # type: Optional[CdmDocumentDefinition]

        # Set of string flags that direct how attribute resolving traits behave.
        # avoid one to many relationship nesting and to use foreign keys for many to one refs.
        self.directives = directives or AttributeResolutionDirectiveSet({'normalized', 'referenceOnly'})  # type: AttributeResolutionDirectiveSet

        # Set of symbol that the current chain of resolution depends upon. Used with import_priority to find what docs and versions of symbols to use.
        self.symbol_ref_set = SymbolSet()  # type: SymbolSet

        # Number of entity attributes that have been travered when collecting resolved traits or attributes. Prevents run away loops.
        self._relationship_depth = None  # type: Optional[int]

        # When references get copied, use previous resolution results if available (for use with copy method).
        self._save_resolutions_on_copy = None  # type: Optional[bool]

        # Forces symbolic references to be re-written to be the precicely located reference based on the wrt_doc.
        self._localize_references_for = None  # type: Optional[CdmDocumentDefinition]

        # Document that is currently being indexed.
        self._indexing_doc = None  # type: Optional[CdmDocumentDefinition]

        self._from_moniker = None  # type: Optional[str]
