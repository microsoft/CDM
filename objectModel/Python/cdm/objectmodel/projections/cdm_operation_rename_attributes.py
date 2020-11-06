# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Dict, List, Optional, TYPE_CHECKING

from cdm.resolvedmodel.projections.projection_attribute_context_tree_builder import ProjectionAttributeContextTreeBuilder
from cdm.resolvedmodel.projections.projection_resolution_common_util import ProjectionResolutionCommonUtil

from cdm.objectmodel import CdmAttribute, CdmAttributeContext
from cdm.enums import CdmAttributeContextType, CdmObjectType, CdmOperationType
from cdm.utilities import AttributeContextParameters, Errors, logger
from cdm.utilities.string_utils import StringUtils

from .cdm_operation_base import CdmOperationBase

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext
    from cdm.resolvedmodel.projections.projection_attribute_state import ProjectionAttributeState
    from cdm.resolvedmodel.projections.projection_attribute_state_set import ProjectionAttributeStateSet
    from cdm.resolvedmodel.projections.projection_context import ProjectionContext
    from cdm.utilities import VisitCallback, ResolveOptions


class CdmOperationRenameAttributes(CdmOperationBase):
    """Class to handle RenameAttributes operations"""

    def __init__(self, ctx: 'CdmCorpusContext') -> None:
        super().__init__(ctx)

        self.rename_format = None  # type: str
        self.apply_to = None  # type: List[str]
        self.type = CdmOperationType.RENAME_ATTRIBUTES  # type: CdmOperationType

        # --- internal ---
        self._TAG = CdmOperationRenameAttributes.__name__

    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmOperationrename_attributes'] = None) -> 'CdmOperationrename_attributes':
        copy = CdmOperationRenameAttributes(self.ctx)
        copy.rename_format = self.rename_format
        if self.apply_to is not None:
            copy.apply_to = self.apply_to[:]
        return copy

    def get_name(self) -> str:
        return 'operationRenameAttributes'

    @property
    def object_type(self) -> 'CdmObjectType':
        return CdmObjectType.OPERATION_RENAME_ATTRIBUTES_DEF

    def validate(self) -> bool:
        missing_fields = []

        if not bool(self.rename_format):
            missing_fields.append('rename_format')

        if len(missing_fields) > 0:
            logger.error(self._TAG, self.ctx, Errors.validate_error_string(self.at_corpus_path, missing_fields))
            return False

        return True

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        path = ''
        if not self.ctx.corpus._block_declared_path_changes:
            path = self._declared_path
            if not path:
                path = path_from + 'operationRenameAttributes'
                self._declared_path = path

        if pre_children and pre_children(self, path):
            return False

        if post_children and post_children(self, path):
            return True

        return False

    def _append_projection_attribute_state(self, proj_ctx: 'ProjectionContext', proj_output_set: 'ProjectionAttributeStateSet', \
                                           attr_ctx: 'CdmAttributeContext') -> 'ProjectionAttributeStateSet':
        # Create a new attribute context for the operation
        attr_ctx_op_rename_attrs_param = AttributeContextParameters()
        attr_ctx_op_rename_attrs_param._under = attr_ctx
        attr_ctx_op_rename_attrs_param._type = CdmAttributeContextType.OPERATION_RENAME_ATTRIBUTES
        attr_ctx_op_rename_attrs_param._name = 'operation/index{}/operationRenameAttributes'.format(self._index)
        attr_ctx_op_rename_attrs = CdmAttributeContext._create_child_under(proj_ctx._projection_directive._res_opt,
                                                                           attr_ctx_op_rename_attrs_param)  # type: CdmAttributeContext

        # Get the list of attributes that will be renamed
        rename_attributes = None  # type: List[str]
        if self.apply_to is not None:
            rename_attributes = self.apply_to
        else:
            rename_attributes = []
            for current_PAS in proj_ctx._current_attribute_state_set._states:
                rename_attributes.append(current_PAS._current_resolved_attribute._resolved_name)

        # Get the top-level attribute names of the attributes to rename
        # We use the top-level names because the rename list may contain a previous name our current resolved attributes had
        top_level_rename_attribute_names = ProjectionResolutionCommonUtil._get_top_list(proj_ctx, rename_attributes)  # type: Dict[str, str]

        source_attribute_name = proj_ctx._projection_directive._original_source_entity_attribute_name  # type: str

        # Initialize a projection attribute context tree builder with the created attribute context for the operation
        attr_ctx_tree_builder = ProjectionAttributeContextTreeBuilder(attr_ctx_op_rename_attrs)

        # Iterate through all the projection attribute states generated from the source's resolved attributes
        # Each projection attribute state contains a resolved attribute that it is corresponding to
        for current_PAS in proj_ctx._current_attribute_state_set._states:
            # Check if the current projection attribute state's resolved attribute is in the list of attributes to rename
            # If this attribute is not in the rename list, then we are including it in the output without changes
            if current_PAS._current_resolved_attribute.resolved_name in top_level_rename_attribute_names:
                if isinstance(current_PAS._current_resolved_attribute.target, CdmAttribute):
                    # The current attribute should be renamed

                    new_attribute_name = self._get_new_attribute_name(current_PAS, source_attribute_name)  # type: str

                    # Create new resolved attribute with the new name, set the new attribute as target
                    res_attr_new = self._create_new_resolved_attribute(proj_ctx, None, current_PAS._current_resolved_attribute.target, new_attribute_name)  # type: ResolvedAttribute

                    # Get the attribute name the way it appears in the applyTo list
                    applyToName = top_level_rename_attribute_names[current_PAS._current_resolved_attribute.resolved_name]

                    # Create the attribute context parameters and just store it in the builder for now
                    # We will create the attribute contexts at the end
                    attr_ctx_tree_builder._create_and_store_attribute_context_parameters(applyToName, current_PAS, res_attr_new, CdmAttributeContextType.ATTRIBUTE_DEFINITION)

                    # Create a projection attribute state for the renamed attribute by creating a copy of the current state
                    # Copy() sets the current state as the previous state for the new one
                    # We only create projection attribute states for attributes that are in the rename list
                    new_PAS = current_PAS._copy()

                    # Update the resolved attribute to be the new renamed attribute we created
                    new_PAS._current_resolved_attribute = res_attr_new

                    proj_output_set._add(new_PAS)
                else:
                    logger.warning(self._TAG, self.ctx, 'RenameAttributes is not supported on an attribute group yet.')
                    # Add the attribute without changes
                    proj_output_set._add(current_PAS)
            else:
                # Pass through
                proj_output_set._add(current_PAS)

        # Create all the attribute contexts and construct the tree
        attr_ctx_tree_builder._construct_attribute_context_tree(proj_ctx, True)

        return proj_output_set

    def _get_new_attribute_name(self, attribute_state: 'ProjectionAttributeState', source_attribute_name: str):
        current_attribute_name = attribute_state._current_resolved_attribute._resolved_name
        ordinal = str(attribute_state._ordinal) if attribute_state._ordinal is not None else ''

        if not self.rename_format:
            logger.error(self._TAG, self.ctx, 'RenameFormat should be set for this operation to work.')
            return ''

        attribute_name = StringUtils._replace(self.rename_format, 'a', source_attribute_name)
        attribute_name = StringUtils._replace(attribute_name, 'o', ordinal)
        attribute_name = StringUtils._replace(attribute_name, 'm', current_attribute_name)

        return attribute_name
