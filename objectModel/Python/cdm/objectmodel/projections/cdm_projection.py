# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional, TYPE_CHECKING

from cdm.enums import CdmObjectType, CdmAttributeContextType
from cdm.objectmodel import CdmObjectDefinition, CdmOperationCollection, CdmAttributeContext
from cdm.resolvedmodel import ResolvedAttributeSet
from cdm.resolvedmodel.expression_parser.expression_tree import ExpressionTree
from cdm.resolvedmodel.expression_parser.input_values import InputValues
from cdm.resolvedmodel.expression_parser.node import Node
from cdm.resolvedmodel.projections.condition_expression import ConditionExpression
from cdm.resolvedmodel.projections.projection_attribute_state_set import ProjectionAttributeStateSet
from cdm.resolvedmodel.projections.projection_context import ProjectionContext
from cdm.resolvedmodel.projections.projection_resolution_common_util import ProjectionResolutionCommonUtil
from cdm.utilities import Errors, logger, AttributeContextParameters

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmEntityReference
    from cdm.utilities import ResolveOptions, VisitCallback

    from cdm.resolvedmodel.projections.projection_directive import ProjectionDirective


class CdmProjection(CdmObjectDefinition):
    """Class for Projection"""

    def __init__(self, ctx: 'CdmCorpusContext') -> None:
        super().__init__(ctx)

        # Property of a projection that holds the condition expression string
        self.condition = None  # type: str

        # Property of a projection that holds a collection of operations
        self.operations = CdmOperationCollection(ctx, self)  # type: CdmOperationCollection

        # Property of a projection that holds the source of the operation
        self.source = None  # type: CdmEntityReference

        # --- internal ---

        # Condition expression tree that is built out of a condition expression string
        self._condition_expression_tree_root = None  # type: Node

        self._TAG = CdmProjection.__name__

    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmProjection'] = None) -> 'CdmProjection':
        logger.error(self._TAG, self.ctx, 'Projection operation not implemented yet.', 'copy')
        return CdmProjection(self.ctx)

    def get_name(self) -> str:
        return 'projection'

    @property
    def object_type(self) -> 'CdmObjectType':
        return CdmObjectType.PROJECTION_DEF

    def is_derived_from(self, base: str, res_opt: Optional['ResolveOptions'] = None) -> bool:
        # Since projections don't support inheritance, return false
        return False

    def validate(self) -> bool:
        missing_fields = []

        if not bool(self.source):
            missing_fields.append('source')

        if len(missing_fields) > 0:
            logger.error(self._TAG, self.ctx, Errors.validate_error_string(self.at_corpus_path, missing_fields))
            return False

        return True

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        path = ''
        if not self.ctx.corpus._block_declared_path_changes:
            path = self._declared_path
            if not path:
                path = path_from + 'projection'
                self._declared_path = path

        if pre_children and pre_children(self, path):
            return False

        if self.source:
            if self.source.visit(path + '/source/', pre_children, post_children):
                return True

        result = False
        if self.operations and len(self.operations) > 0:
            # since self.Operations.VisitList results is non-unique attribute context paths if there are 2 or more operations of the same type.
            # e.g. with composite keys
            # the solution is to add a unique identifier to the path by adding the operation index or opIdx
            for op_index in range(len(self.operations)):
                self.operations[op_index]._index = op_index + 1
                if self.operations[op_index] and self.operations[op_index].visit('{}/operation/index{}/'.format(path, op_index + 1), pre_children, post_children):
                    result = True
                else:
                    result = False
            if result:
                return True

        if post_children and post_children(self, path):
            return True

        return False

    def _fetch_resolved_traits(self, res_opt: Optional['ResolveOptions'] = None) -> 'ResolvedTraitSet':
        return self.source._fetch_resolved_traits(res_opt)

    def _construct_projection_context(self, proj_directive: 'ProjectionDirective', attr_ctx: 'CdmAttributeContext') -> 'ProjectionContext':
        """
        A function to construct projection context and populate the resolved attribute set that ExtractResolvedAttributes method can then extract
        This function is the entry point for projection resolution.
        This function is expected to do the following 3 things:
        - Create an condition expression tree & default if appropriate
        - Create and initialize Projection Context
        - Process operations
        """
        proj_context = None

        if not self.condition:
            # if no condition is provided, get default condition and persist
            self.condition = ConditionExpression._get_default_condition_expression(self.operations, self.owner)

        # create an expression tree based on the condition
        tree = ExpressionTree()
        self._condition_expression_tree_root = tree._construct_expression_tree(self.condition)
        if not self._condition_expression_tree_root:
            logger.info(self._TAG, self.ctx, 'Optional expression missing. Implicit expression will automatically apply.', CdmProjection._construct_projection_context.__name__)

        if attr_ctx:
            # Add projection to context tree
            acp_proj = AttributeContextParameters()
            acp_proj._under = attr_ctx
            acp_proj._type = CdmAttributeContextType.PROJECTION
            acp_proj._name = self.fetch_object_definition_name()
            acp_proj._regarding = proj_directive._owner_ref
            acp_proj._include_traits = False

            ac_proj = CdmAttributeContext._create_child_under(proj_directive._res_opt, acp_proj)

            acp_source = AttributeContextParameters()
            acp_source._under = ac_proj
            acp_source._type = CdmAttributeContextType.SOURCE
            acp_source._name = 'source'
            acp_source._regarding = None
            acp_source._include_traits = False

            ac_source = CdmAttributeContext._create_child_under(proj_directive._res_opt, acp_source)

            if self.source.fetch_object_definition(proj_directive._res_opt).object_type == CdmObjectType.PROJECTION_DEF:
                # A Projection

                proj_context = self.source.explicit_reference._construct_projection_context(proj_directive, ac_source)
            else:
                # An Entity Reference

                acp_source_projection = AttributeContextParameters()
                acp_source_projection._under = ac_source
                acp_source_projection._type = CdmAttributeContextType.ENTITY
                acp_source_projection._name = self.source.named_reference if self.source.named_reference else self.source.explicit_reference.get_name()
                acp_source_projection._regarding = self.source
                acp_source_projection._include_traits = False

                ras = self.source._fetch_resolved_attributes(proj_directive._res_opt, acp_source_projection)

                # Initialize the projection context

                ctx = proj_directive._owner.ctx if proj_directive._owner else None

                pas_set = None

                # if polymorphic keep original source as previous state
                poly_source_set = None
                if proj_directive._is_source_polymorphic:
                    poly_source_set = ProjectionResolutionCommonUtil._get_polymorphic_source_set(proj_directive, ctx, self.source, acp_source_projection)

                # now initialize projection attribute state
                pas_set = ProjectionResolutionCommonUtil._initialize_projection_attribute_state_set(
                    proj_directive,
                    ctx,
                    ras,
                    proj_directive._is_source_polymorphic,
                    poly_source_set
                )

                proj_context = ProjectionContext(proj_directive, ras.attribute_context)
                proj_context._current_attribute_state_set = pas_set

            is_condition_valid = False
            if self._condition_expression_tree_root:
                input = InputValues()
                input.no_max_depth = proj_directive._has_no_maximum_depth
                input.is_array = proj_directive._is_array
                input.reference_only = proj_directive._is_reference_only
                input.normalized = proj_directive._is_normalized
                input.structured = proj_directive._is_structured

                current_depth = proj_directive._current_depth
                current_depth += 1
                input.next_depth = current_depth
                proj_directive._current_depth = current_depth

                input.max_depth = proj_directive._maximum_depth
                input.min_cardinality = proj_directive._cardinality._minimum_number if proj_directive._cardinality else None
                input.max_cardinality = proj_directive._cardinality._maximum_number if proj_directive._cardinality else None

                is_condition_valid = ExpressionTree._evaluate_expression_tree(self._condition_expression_tree_root, input)

            if is_condition_valid and self.operations and len(self.operations) > 0:
                # Just in case operations were added programmatically, reindex operations
                for i in range(len(self.operations)):
                    self.operations[i]._index = i + 1

                # Operation

                acp_gen_attr_set = AttributeContextParameters()
                acp_gen_attr_set._under = attr_ctx
                acp_gen_attr_set._type = CdmAttributeContextType.GENERATED_SET
                acp_gen_attr_set._name = '_generatedAttributeSet'

                ac_gen_attr_set = CdmAttributeContext._create_child_under(proj_directive._res_opt, acp_gen_attr_set)

                acp_gen_attr_round0 = AttributeContextParameters()
                acp_gen_attr_round0._under = ac_gen_attr_set
                acp_gen_attr_round0._type = CdmAttributeContextType.GENERATED_ROUND
                acp_gen_attr_round0._name = '_generatedAttributeRound0'

                ac_gen_attr_round0 = CdmAttributeContext._create_child_under(proj_directive._res_opt, acp_gen_attr_round0)

                # Start with an empty list for each projection
                pas_operations = ProjectionAttributeStateSet(proj_context._current_attribute_state_set._ctx)
                for operation in self.operations:
                    # Evaluate projections and apply to empty state
                    new_pas_operations = operation._append_projection_attribute_state(proj_context, pas_operations, ac_gen_attr_round0)

                    # If the operations fails or it is not implemented the projection cannot be evaluated so keep previous valid state.
                    if new_pas_operations is not None:
                        pas_operations = new_pas_operations

                # Finally update the current state to the projection context
                proj_context._current_attribute_state_set = pas_operations

        return proj_context

    def _extract_resolved_attributes(self, proj_ctx: 'ProjectionContext') -> 'ResolvedAttributeSet':
        """Create resolved attribute set based on the CurrentResolvedAttribute array"""
        resolved_attribute_set = ResolvedAttributeSet()
        resolved_attribute_set.attribute_context = proj_ctx._current_attribute_context

        for pas in proj_ctx._current_attribute_state_set._values:
            resolved_attribute_set.merge(pas._current_resolved_attribute, pas._current_resolved_attribute.att_ctx)

        return resolved_attribute_set
