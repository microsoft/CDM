# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import abc
from typing import Optional, TYPE_CHECKING, List

from cdm.enums.cdm_operation_type import CdmOperationType
from cdm.objectmodel import CdmObjectDefinition
from cdm.resolvedmodel import ResolvedAttribute

if TYPE_CHECKING:
    from cdm.enums import CdmObjectType
    from cdm.objectmodel import CdmAttribute, CdmAttributeContext, CdmCorpusContext
    from cdm.utilities import ResolveOptions, VisitCallback

    from cdm.resolvedmodel.projections.projection_attribute_state_set import ProjectionAttributeStateSet
    from cdm.resolvedmodel.projections.projection_context import ProjectionContext


class CdmOperationBase(CdmObjectDefinition):
    """Base class for all operations"""

    def __init__(self, ctx: 'CdmCorpusContext') -> None:
        super().__init__(ctx)

        self.type = None  # type: CdmOperationType

        # Property of an operation that holds the condition expression string
        self.condition = None  # type: Optional[bool]

        # Property of an operation that defines if the operation receives the input from previous operation or from source entity
        self.source_input = None  # type: Optional[bool]

        # --- internal ---

        # The index of an operation
        # In a projection's operation collection, 2 same type of operation may cause duplicate attribute context
        # To avoid that we add an index
        self._index = None  # type: int

    @abc.abstractmethod
    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmOperationBase'] = None) -> 'CdmOperationBase':
        raise NotImplementedError()

    @abc.abstractmethod
    def get_name(self) -> str:
        raise NotImplementedError()

    @property
    @abc.abstractmethod
    def object_type(self) -> 'CdmObjectType':
        raise NotImplementedError()

    def is_derived_from(self, base: str, res_opt: Optional['ResolveOptions'] = None) -> bool:
        return False

    @abc.abstractmethod
    def validate(self) -> bool:
        raise NotImplementedError()

    @abc.abstractmethod
    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        raise NotImplementedError()

    @abc.abstractmethod
    def _append_projection_attribute_state(self, proj_ctx: 'ProjectionContext', proj_attr_state_set: 'ProjectionAttributeStateSet', attr_ctx: 'CdmAttributeContext') -> 'ProjectionAttributeStateSet':
        """A function to cumulate the projection attribute states"""
        raise NotImplementedError()

    @staticmethod
    def _create_new_resolved_attribute(
            proj_ctx: 'ProjectionContext',
            attr_ctx_under: 'CdmAttributeContext',
            target_attr: 'CdmAttribute',
            override_default_name: Optional[str] = None,
            added_simple_ref_traits: Optional[List[str]] = None
    ) -> 'ResolvedAttribute':
        """
        Projections require a new resolved attribute to be created multiple times
        This function allows us to create new resolved attributes based on a input attribute
        """
        target_attr = target_attr.copy()

        new_res_attr = ResolvedAttribute(
            proj_ctx._projection_directive._res_opt,
            target_attr,
            override_default_name if override_default_name else target_attr.get_name(),
            attr_ctx_under
        )

        target_attr.in_document = proj_ctx._projection_directive._owner.in_document

        if added_simple_ref_traits is not None:
            for trait in added_simple_ref_traits:
                if target_attr.applied_traits.item(trait) == None:
                    target_attr.applied_traits.append(trait, True)

        res_trait_set = target_attr._fetch_resolved_traits(proj_ctx._projection_directive._res_opt)

        # Create deep a copy of traits to avoid conflicts in case of parameters
        if res_trait_set is not None:
            new_res_attr.resolved_traits = res_trait_set.deep_copy()

        return new_res_attr
