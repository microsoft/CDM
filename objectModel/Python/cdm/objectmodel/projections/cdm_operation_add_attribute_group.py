# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional, TYPE_CHECKING

from cdm.enums import CdmAttributeContextType, CdmObjectType, CdmOperationType
from cdm.objectmodel import CdmAttributeContext
from cdm.resolvedmodel import ResolvedAttribute, ResolvedAttributeSetBuilder
from cdm.resolvedmodel.projections.projection_attribute_state import ProjectionAttributeState
from cdm.utilities import AttributeContextParameters, Errors, logger

from .cdm_operation_base import CdmOperationBase

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext
    from cdm.resolvedmodel.projections.projection_attribute_state_set import ProjectionAttributeStateSet
    from cdm.resolvedmodel.projections.projection_context import ProjectionContext
    from cdm.utilities import VisitCallback, ResolveOptions


class CdmOperationAddAttributeGroup(CdmOperationBase):
    """Class to handle AddAttributeGroup operations"""

    def __init__(self, ctx: 'CdmCorpusContext') -> None:
        super().__init__(ctx)

        # Name given to the attribute group that will be created
        self.attribute_group_name = None  # type: Optional[str]
        self.type = CdmOperationType.ADD_ATTRIBUTE_GROUP  # type: CdmOperationType

        # --- internal ---
        self._TAG = CdmOperationAddAttributeGroup.__name__

    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmOperationAddAttributeGroup'] = None) -> 'CdmOperationAddAttributeGroup':
        copy = CdmOperationAddAttributeGroup(self.ctx)
        copy.attribute_group_name = self.attribute_group_name
        return copy

    def get_name(self) -> str:
        return 'operationAddAttributeGroup'

    @property
    def object_type(self) -> 'CdmObjectType':
        return CdmObjectType.OPERATION_ADD_ATTRIBUTE_GROUP_DEF

    def validate(self) -> bool:
        missing_fields = []

        if not bool(self.attribute_group_name):
            missing_fields.append('attribute_group_name')

        if len(missing_fields) > 0:
            logger.error(self._TAG, self.ctx, Errors.validate_error_string(self.at_corpus_path, missing_fields))
            return False

        return True

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        path = ''
        if not self.ctx.corpus._block_declared_path_changes:
            path = self._declared_path
            if not path:
                path = path_from + self.get_name()
                self._declared_path = path

        if pre_children and pre_children(self, path):
            return False

        if post_children and post_children(self, path):
            return True

        return False

    def _append_projection_attribute_state(self, proj_ctx: 'ProjectionContext', proj_output_set: 'ProjectionAttributeStateSet', \
                                           attr_ctx: 'CdmAttributeContext') -> 'ProjectionAttributeStateSet':
        # Create a new attribute context for the operation
        attr_ctx_op_add_attr_group_param = AttributeContextParameters()
        attr_ctx_op_add_attr_group_param._under = attr_ctx
        attr_ctx_op_add_attr_group_param._type = CdmAttributeContextType.OPERATION_ADD_ATTRIBUTE_GROUP
        attr_ctx_op_add_attr_group_param._name = 'operation/index{}/{}'.format(self._index, self.get_name())
        attr_ctx_op_add_attr_group = CdmAttributeContext._create_child_under(proj_ctx._projection_directive._res_opt, attr_ctx_op_add_attr_group_param)

        # Create a new attribute context for the attribute group we will create
        attr_ctx_attr_group_param = AttributeContextParameters()
        attr_ctx_attr_group_param._under = attr_ctx_op_add_attr_group
        attr_ctx_attr_group_param._type = CdmAttributeContextType.ATTRIBUTE_DEFINITION
        attr_ctx_attr_group_param._name = self.attribute_group_name
        attr_ctx_attr_group = CdmAttributeContext._create_child_under(proj_ctx._projection_directive._res_opt, attr_ctx_attr_group_param)

        # Create a new resolve attribute set builder that will be used to combine all the attributes into one set
        rasb = ResolvedAttributeSetBuilder()

        # Iterate through all the projection attribute states generated from the source's resolved attributes
        # Each projection attribute state contains a resolved attribute that it is corresponding to
        for current_PAS in proj_ctx._current_attribute_state_set._states:
            # Create an attribute set build that owns one resolved attribute
            attribute_rasb = ResolvedAttributeSetBuilder()
            attribute_rasb.own_one(current_PAS._current_resolved_attribute)

            # Merge the attribute set containing one attribute with the one holding all the attributes
            rasb.merge_attributes(attribute_rasb.ras)

            # Add each attribute's attribute context to the resolved attribute set attribute context
            attr_ctx_attr_group.contents.append(current_PAS._current_resolved_attribute.att_ctx)

        # Create a new resolved attribute that will hold the attribute set containing all the attributes
        res_attr_new = ResolvedAttribute(proj_ctx._projection_directive._res_opt, rasb.ras, self.attribute_group_name, attr_ctx_attr_group)

        # Create a new projection attribute state pointing to the resolved attribute set that represents the attribute group
        new_PAS = ProjectionAttributeState(self.ctx)
        new_PAS._current_resolved_attribute = res_attr_new
        proj_output_set._add(new_PAS)

        return proj_output_set
