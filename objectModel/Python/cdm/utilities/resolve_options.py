# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional, Union, TYPE_CHECKING
import warnings

from cdm.enums import CdmObjectType, ImportsLoadStrategy
from cdm.utilities import DepthInfo

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
        # Provided or default to 'avoid one to many relationship nesting and to use foreign keys for many to one refs'.
        # this is for back compat with behavior before the corpus has a default directive property
        self.directives = directives.copy() if directives else AttributeResolutionDirectiveSet(
            {'normalized', 'referenceOnly'})  # type: AttributeResolutionDirectiveSet

        # When enabled, errors regarding references that are unable to be resolved or loaded are logged as warnings instead.
        self.shallow_validation = None  # type: Optional[bool]

        # Defines at which point the Object Model will try to load the imported documents.
        self.imports_load_strategy = ImportsLoadStrategy.LAZY_LOAD  # type: ImportsLoadStrategy

        # The limit for the number of resolved attributes allowed per entity. if the number is exceeded, the resolution will fail
        self._resolved_attribute_limit = 4000  # type: Optional[int]

        # The maximum value for the end ordinal in an ArrayExpansion operation
        self.max_ordinal_for_array_expansion = 20  # type: int

        # The maximum depth that entity attributes will be resolved before giving up
        self.max_depth = 2

        # Set of symbol that the current chain of resolution depends upon. Used with import_priority to find what docs and versions of symbols to use.
        self._symbol_ref_set = SymbolSet()  # type: SymbolSet

        # Contains information about the depth that we are resolving at
        self._depth_info = DepthInfo()  # type: Optional[DepthInfo]

        # Indicates whether we are resolving inside of a circular reference, resolution is different in that case
        self._in_circular_reference = False  # type: bool

        self._currently_resolving_entities = set()  # type: Set[CdmEntityDefinition]

        # When references get copied, use previous resolution results if available (for use with copy method).
        self._save_resolutions_on_copy = None  # type: Optional[bool]

        # Forces symbolic references to be re-written to be the precisely located reference based on the wrt_doc.
        self._localize_references_for = None  # type: Optional[CdmDocumentDefinition]

        # Document that is currently being indexed.
        self._indexing_doc = None  # type: Optional[CdmDocumentDefinition]

        self._from_moniker = None  # type: Optional[str]

        self._map_old_ctx_to_new_ctx = None  # type: Dict['CdmAttributeContext', 'CdmAttributeContext']

        # Indicates if resolution guidance was used at any point during resolution
        self._used_resolution_guidance = False  # type: bool

    @property
    def strict_validation(self) -> Optional[bool]:
        """When enabled, all the imports will be loaded and the references checked otherwise will be delayed until the symbols are required."""
        warnings.warn('Please use imports_load_strategy instead.', DeprecationWarning)
        if self.imports_load_strategy == ImportsLoadStrategy.LAZY_LOAD:
            return None
        return self.imports_load_strategy == ImportsLoadStrategy.LOAD

    @strict_validation.setter
    def strict_validation(self, value: Optional[bool]) -> None:
        """When enabled, all the imports will be loaded and the references checked otherwise will be delayed until the symbols are required."""
        warnings.warn('Please use imports_load_strategy instead.', DeprecationWarning)
        if value is None:
            self.imports_load_strategy = ImportsLoadStrategy.LAZY_LOAD
        elif value:
            self.imports_load_strategy = ImportsLoadStrategy.LOAD
        else:
            self.imports_load_strategy = ImportsLoadStrategy.DO_NOT_LOAD

    def _check_attribute_count(self, amount: int) -> bool:
        """
        Checks if the limit for the number of attributes an entity can have has been reached
        """
        if self._resolved_attribute_limit:
            if amount > self._resolved_attribute_limit:
                return False
        return True

    def copy(self) -> 'ResolveOptions':
        res_opt_copy = ResolveOptions()
        res_opt_copy.wrt_doc = self.wrt_doc
        res_opt_copy._depth_info = self._depth_info._copy()
        res_opt_copy._in_circular_reference = self._in_circular_reference
        res_opt_copy._localize_references_for = self._localize_references_for
        res_opt_copy._indexing_doc = self._indexing_doc
        res_opt_copy.shallow_validation = self.shallow_validation
        res_opt_copy._resolved_attribute_limit = self._resolved_attribute_limit
        res_opt_copy._map_old_ctx_to_new_ctx = self._map_old_ctx_to_new_ctx  # ok to share this map
        res_opt_copy.imports_load_strategy = self.imports_load_strategy
        res_opt_copy._save_resolutions_on_copy = self._save_resolutions_on_copy
        res_opt_copy._currently_resolving_entities = self._currently_resolving_entities # ok to share this map
        res_opt_copy._used_resolution_guidance = self._used_resolution_guidance

        if self.directives:
            res_opt_copy.directives = self.directives.copy()

        return res_opt_copy
