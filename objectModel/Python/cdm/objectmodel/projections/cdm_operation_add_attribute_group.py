# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional, TYPE_CHECKING

from cdm.enums import CdmLogCode
from cdm.utilities.string_utils import StringUtils
from cdm.enums import CdmAttributeContextType, CdmObjectType, CdmOperationType
from cdm.objectmodel import CdmAttributeContext
from cdm.resolvedmodel import ResolvedAttribute, ResolvedAttributeSetBuilder
from cdm.resolvedmodel.projections.projection_attribute_state import ProjectionAttributeState
from cdm.utilities import AttributeContextParameters, logger

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

        self._TAG = CdmOperationAddAttributeGroup.__name__

        # Name given to the attribute group that will be created
        self.attribute_group_name = None  # type: Optional[str]
        self.type = CdmOperationType.ADD_ATTRIBUTE_GROUP  # type: CdmOperationType

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
            logger.error(self.ctx, self._TAG, 'validate', self.at_corpus_path, CdmLogCode.ERR_VALDN_INTEGRITY_CHECK_FAILURE,
                         self.at_corpus_path, ', '.join(map(lambda s: '\'' + s + '\'', missing_fields)))
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
            # Create a copy of the resolved attribute
            resolved_attribute = current_PAS._current_resolved_attribute.copy()  # type: ResolvedAttribute

            # Add the attribute to the resolved attribute set
            rasb._resolved_attribute_set.merge(resolved_attribute)

            # Add each attribute's attribute context to the resolved attribute set attribute context
            attr_param = AttributeContextParameters()
            attr_param._under = attr_ctx_attr_group
            attr_param._type = CdmAttributeContextType.ATTRIBUTE_DEFINITION
            attr_param._name = resolved_attribute.resolved_name
            resolved_attribute.att_ctx = CdmAttributeContext._create_child_under(proj_ctx._projection_directive._res_opt, attr_param)
            resolved_attribute.att_ctx._add_lineage(current_PAS._current_resolved_attribute.att_ctx)

        # Create a new resolved attribute that will hold the attribute set containing all the attributes
        res_attr_new = ResolvedAttribute(proj_ctx._projection_directive._res_opt, rasb._resolved_attribute_set, self.attribute_group_name, attr_ctx_attr_group)

        # Create a new projection attribute state pointing to the resolved attribute set that represents the attribute group
        new_PAS = ProjectionAttributeState(self.ctx)
        new_PAS._current_resolved_attribute = res_attr_new
        proj_output_set._add(new_PAS)

        return proj_output_set
