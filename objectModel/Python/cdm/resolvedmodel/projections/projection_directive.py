# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional, TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.objectmodel.projections.cardinality_settings import CardinalitySettings
from cdm.utilities import DepthInfo

if TYPE_CHECKING:
    from cdm.objectmodel import CdmObjectDefinition, CdmObjectReference
    from cdm.utilities import ResolveOptions


class ProjectionDirective:
    """
    Directives to pass to the top level projection on resolution
    ProjectionDirective contains all the inputs for a projection towards resolution.
    ProjectionContext is the context that initializes, lives and evolves through the projection resolution process.
    ProjectionContext contains an instance of ProjectionDirective.
    """

    def __init__(self, res_opt: 'ResolveOptions', owner: 'CdmObjectDefinition', owner_ref: Optional['CdmObjectReference'] = None):
        # --- internal ---

        # Resolution option used
        self._res_opt = res_opt  # type: ResolveOptions

        # The calling referencing EntityDef or the EntityAttributeDef that contains this projection
        self._owner = owner  # type: CdmObjectDefinition

        # The EntityRef to the owning EntityDef or EntityAttributeDef
        self._owner_ref = owner_ref  # type: CdmObjectReference

        # Is Owner EntityDef or EntityAttributeDef
        self._owner_type = owner.object_type if owner else CdmObjectType.ERROR  # type: CdmObjectType

        if owner and owner.object_type == CdmObjectType.ENTITY_ATTRIBUTE_DEF:
            # If EntityAttributeDef - then the Cardinality from the Owner EntityAttributeDef
            # This is ignored for EntityDef and will default to min:max = 0:1
            self._cardinality = owner.cardinality if owner.cardinality else CardinalitySettings(owner)  # type: CardinalitySettings
            # For entity attribute - get if the source is polymorphic
            self._is_source_polymorphic = owner.is_polymorphic_source is not None and owner.is_polymorphic_source == True  # type: bool
        else:
            self._cardinality = None
            self._is_source_polymorphic = False

        # Is referenceOnly
        self._is_reference_only = res_opt.directives.has('referenceOnly') == True if res_opt.directives else False  # type: bool

        # Is normalized
        self._is_normalized = res_opt.directives.has('normalized') == True if res_opt.directives else False  # type: bool

        #  Is structured
        self._is_structured = res_opt.directives.has('structured') == True if res_opt.directives else False  # type: bool

        #  Is virtual
        self._is_virtual = res_opt.directives.has('virtual') == True if res_opt.directives else False  # type: bool

        # Has maximum depth override flag
        self._has_no_maximum_depth = res_opt.directives.has('noMaxDepth') == True if res_opt.directives else False  # type: bool

        # Is array
        self._is_array = res_opt.directives.has('isArray') == True if res_opt.directives else False  # type: Optional[bool]

        # if noMaxDepth directive the max depth is 32 else defaults to what was set by the user
        # these depths were arbitrary and were set for the resolution guidance
        # re-using the same for projections as well
        self._maximum_depth = DepthInfo.MAX_DEPTH_LIMIT if self._has_no_maximum_depth else res_opt.max_depth  # type: Optional[int]

    @property
    def _original_source_entity_attribute_name(self) -> str:
        """
        The entity attribute name or "{a/A}"
        This may pass through at each operation action/transformation
        """
        return self._owner.get_name() if self._owner.object_type == CdmObjectType.ENTITY_ATTRIBUTE_DEF else None
