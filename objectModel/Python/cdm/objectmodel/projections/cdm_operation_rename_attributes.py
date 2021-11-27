# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Dict, List, Optional, TYPE_CHECKING

from cdm.resolvedmodel.projections.projection_attribute_context_tree_builder import ProjectionAttributeContextTreeBuilder
from cdm.resolvedmodel.projections.projection_resolution_common_util import ProjectionResolutionCommonUtil

from cdm.objectmodel import CdmAttribute, CdmAttributeContext
from cdm.enums import CdmAttributeContextType, CdmObjectType, CdmOperationType
from cdm.utilities import AttributeContextParameters, logger
from cdm.enums import CdmLogCode
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

        self._TAG = CdmOperationRenameAttributes.__name__
        self.rename_format = None  # type: str
        self.apply_to = None  # type: List[str]
        self.type = CdmOperationType.RENAME_ATTRIBUTES  # type: CdmOperationType

    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmOperationRenameAttributes'] = None) -> 'CdmOperationRenameAttributes':
        if not res_opt:
            res_opt = ResolveOptions(wrt_doc=self, directives=self.ctx.corpus.default_resolution_directives)

        copy = CdmOperationRenameAttributes(self.ctx) if not host else host

        if self.apply_to is not None:
            copy.apply_to = self.apply_to.copy()
        copy.rename_format = self.rename_format

        self._copy_proj(res_opt, copy)
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
            logger.error(self.ctx, self._TAG, 'validate', self.at_corpus_path, CdmLogCode.ERR_VALDN_INTEGRITY_CHECK_FAILURE, self.at_corpus_path, ', '.join(map(lambda s: '\'' + s + '\'', missing_fields)))
            return False
        
        return True

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        path = self._fetch_declared_path(path_from)

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

                    new_attribute_name = self._get_new_attribute_name(proj_ctx._projection_directive._original_source_attribute_name, current_PAS)  # type: str

                    # Create new resolved attribute with the new name, set the new attribute as target
                    res_attr_new = self._create_new_resolved_attribute(proj_ctx, None, current_PAS._current_resolved_attribute, new_attribute_name)  # type: ResolvedAttribute

                    # Get the attribute name the way it appears in the applyTo list
                    apply_to_name = top_level_rename_attribute_names[current_PAS._current_resolved_attribute.resolved_name]

                    # Create the attribute context parameters and just store it in the builder for now
                    # We will create the attribute contexts at the end
                    attr_ctx_tree_builder._create_and_store_attribute_context_parameters(
                        apply_to_name, current_PAS, res_attr_new,
                        CdmAttributeContextType.ATTRIBUTE_DEFINITION,
                        current_PAS._current_resolved_attribute.att_ctx,  # lineage is the original attribute
                        None)  # don't know who will point here yet

                    # Create a projection attribute state for the renamed attribute by creating a copy of the current state
                    # Copy() sets the current state as the previous state for the new one
                    # We only create projection attribute states for attributes that are in the rename list
                    new_PAS = current_PAS._copy()

                    # Update the resolved attribute to be the new renamed attribute we created
                    new_PAS._current_resolved_attribute = res_attr_new

                    proj_output_set._add(new_PAS)
                else:
                    logger.warning(self.ctx, self._TAG,
                                   CdmOperationRenameAttributes._append_projection_attribute_state.__name__, self.at_corpus_path,
                                   CdmLogCode.WARN_PROJ_RENAME_ATTR_NOT_SUPPORTED)
                    # Add the attribute without changes
                    proj_output_set._add(current_PAS)
            else:
                # Pass through
                proj_output_set._add(current_PAS)

        # Create all the attribute contexts and construct the tree
        attr_ctx_tree_builder._construct_attribute_context_tree(proj_ctx)

        return proj_output_set

    def _get_new_attribute_name(self, projection_owner_name: str, current_PAS: 'ProjectionAttributeState'):
        if not self.rename_format:
            logger.error(self.ctx, self._TAG, self.getNewAttributeName.__name__, self.at_corpus_path, CdmLogCode.ERR_PROJ_RENAME_FORMAT_IS_NOT_SET)
            return ''

        return self._replace_wildcard_characters(self.rename_format, projection_owner_name, current_PAS)
