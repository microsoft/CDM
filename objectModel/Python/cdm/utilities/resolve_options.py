# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional, Union, TYPE_CHECKING

from cdm.enums import CdmObjectType

if TYPE_CHECKING:
    from cdm.objectmodel import CdmDocumentDefinition, CdmObject

    from . import AttributeResolutionDirectiveSet

def fetch_document(obj: 'CdmObject') -> Optional['CdmDocumentDefinition']:
    if obj is None:
        return None
    
    if obj.object_type == CdmObjectType.DOCUMENT_DEF:
        return obj
    
    if obj.owner is None:
        return None
    
    return obj.owner.in_document


class ResolveOptions:
    def __init__(self, wrt_doc: Optional[Union['CdmDocumentDefinition', 'CdmObject']] = None, directives: Optional['AttributeResolutionDirectiveSet'] = None) \
        -> None:
        from . import AttributeResolutionDirectiveSet, SymbolSet

        # Document to use as a point of reference when resolving relative paths and symbol names.
        self.wrt_doc = fetch_document(wrt_doc)  # type: Optional[CdmDocumentDefinition]

        # Set of string flags that direct how attribute resolving traits behave.
        # avoid one to many relationship nesting and to use foreign keys for many to one refs.
        self.directives = directives or AttributeResolutionDirectiveSet({'normalized', 'referenceOnly'})  # type: AttributeResolutionDirectiveSet

        # When enabled, errors regarding references that are unable to be resolved or loaded are logged as warnings instead.
        self.shallow_validation = None  # type: Optional[bool]

        # The limit for the number of resolved attributes allowed per entity. if the number is exceeded, the resolution will fail
        self._resolved_attribute_limit = 4000  # type: Optional[int]
        
        # Set of symbol that the current chain of resolution depends upon. Used with import_priority to find what docs and versions of symbols to use.
        self._symbol_ref_set = SymbolSet()  # type: SymbolSet

        # Number of entity attributes that have been travered when collecting resolved traits or attributes. Prevents run away loops.
        self._relationship_depth = None  # type: Optional[int]

        # When references get copied, use previous resolution results if available (for use with copy method).
        self._save_resolutions_on_copy = None  # type: Optional[bool]

        # Forces symbolic references to be re-written to be the precisely located reference based on the wrt_doc.
        self._localize_references_for = None  # type: Optional[CdmDocumentDefinition]

        # Document that is currently being indexed.
        self._indexing_doc = None  # type: Optional[CdmDocumentDefinition]

        self._from_moniker = None  # type: Optional[str]

    def _check_attribute_count(self, amount: int) -> bool:
        """
        Checks if the limit for the number of attributes an entity can have has been reached
        """
        if self._resolved_attribute_limit:
            if amount > self._resolved_attribute_limit:
                return False
        return True


