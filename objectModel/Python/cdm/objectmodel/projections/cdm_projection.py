# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional, TYPE_CHECKING

from cdm.enums import CdmObjectType, CdmAttributeContextType
from cdm.objectmodel import CdmObjectDefinition, CdmOperationCollection, CdmAttributeContext
from cdm.resolvedmodel import ResolvedAttributeSet
from cdm.resolvedmodel.expression_parser.expression_tree import ExpressionTree
from cdm.resolvedmodel.expression_parser.input_values import InputValues
from cdm.resolvedmodel.expression_parser.node import Node
from cdm.resolvedmodel.projections.projection_attribute_state_set import ProjectionAttributeStateSet
from cdm.resolvedmodel.projections.projection_context import ProjectionContext
from cdm.resolvedmodel.projections.projection_resolution_common_util import ProjectionResolutionCommonUtil
from cdm.utilities import logger, AttributeContextParameters
from cdm.enums import CdmLogCode
from cdm.utilities.string_utils import StringUtils

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmEntityReference
    from cdm.utilities import ResolveOptions, VisitCallback

    from cdm.resolvedmodel.projections.projection_directive import ProjectionDirective


class CdmProjection(CdmObjectDefinition):
    """Class for Projection"""

    def __init__(self, ctx: 'CdmCorpusContext') -> None:
        super().__init__(ctx)

        self._TAG = CdmProjection.__name__

        # Property of a projection that holds the condition expression string
        self.condition = None  # type: str

        # Property of a projection that holds a collection of operations
        self.operations = CdmOperationCollection(ctx, self)  # type: CdmOperationCollection

        self.run_sequentially = None  # type: Optional[bool]

        # --- internal ---

        # Property of a projection that holds the source of the operation
        self._source = None  # type: Optional[CdmEntityReference]

    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmProjection'] = None) -> 'CdmProjection':
        copy = None

        if not host:
            copy = CdmProjection(self.ctx)
        else:
            copy = host
            copy.ctx = self.ctx
            copy.operations.clear()
        
        copy.condition = self.condition
        copy.source = self.source.copy(res_opt) if self.source else None

        for operation in self.operations:
            copy.operations.append(operation.copy(res_opt))

        # Don't do anything else after this, as it may cause InDocument to become dirty
        copy.in_document = self.in_document

        return copy

    def get_name(self) -> str:
        return 'projection'

    @property
    def object_type(self) -> 'CdmObjectType':
        return CdmObjectType.PROJECTION_DEF

    @property
    def source(self) -> Optional['CdmEntityReference']:
        return self._source

    @source.setter
    def source(self, value: Optional['CdmEntityReference']) -> None:
        if value:
            value.owner = self
        self._source = value

    def is_derived_from(self, base: str, res_opt: Optional['ResolveOptions'] = None) -> bool:
        # Since projections don't support inheritance, return false
        return False

    def validate(self) -> bool:
        missing_fields = []

        if not self.source:
            root_owner = self._get_root_owner()
            if root_owner.object_type != CdmObjectType.TYPE_ATTRIBUTE_DEF:
                # If the projection is used in an entity attribute or an extends entity
                missing_fields.append('source')
        elif not self.source.explicit_reference or self.source.explicit_reference.object_type != CdmObjectType.PROJECTION_DEF:
            # If reached the inner most projection
            root_owner = self._get_root_owner()
            if root_owner.object_type == CdmObjectType.TYPE_ATTRIBUTE_DEF:
                # If the projection is used in a type attribute
               logger.error(self.ctx, self._TAG, 'validate', self.at_corpus_path, CdmLogCode.ERR_PROJ_SOURCE_ERROR)

        if len(missing_fields) > 0:
            logger.error(self.ctx, self._TAG, 'validate', self.at_corpus_path, CdmLogCode.ERR_VALDN_INTEGRITY_CHECK_FAILURE, self.at_corpus_path, ', '.join(map(lambda s: '\'' + s + '\'', missing_fields)))
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

    def _construct_projection_context(self, proj_directive: 'ProjectionDirective', attr_ctx: 'CdmAttributeContext', ras: Optional['ResolvedAttributeSet'] = None) -> 'ProjectionContext':
        """
        A function to construct projection context and populate the resolved attribute set that ExtractResolvedAttributes method can then extract
        This function is the entry point for projection resolution.
        This function is expected to do the following 3 things:
        - Create an condition expression tree & default if appropriate
        - Create and initialize Projection Context
        - Process operations
        """
        if not attr_ctx:
            return None

        proj_context = None

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

        # Initialize the projection context
        ctx = proj_directive._owner.ctx if proj_directive._owner else None

        if self.source:
            source = self.source.fetch_object_definition(proj_directive._res_opt)
            if source.object_type == CdmObjectType.PROJECTION_DEF:
                # A Projection

                proj_context = source._construct_projection_context(proj_directive, ac_source, ras)
            else:
                # An Entity Reference

                acp_source_projection = AttributeContextParameters()
                acp_source_projection._under = ac_source
                acp_source_projection._type = CdmAttributeContextType.ENTITY
                acp_source_projection._name = self.source.named_reference if self.source.named_reference else self.source.explicit_reference.get_name()
                acp_source_projection._regarding = self.source
                acp_source_projection._include_traits = False

                ras = self.source._fetch_resolved_attributes(proj_directive._res_opt, acp_source_projection)  # type: ResolvedAttributeSet
                # clean up the context tree, it was left in a bad state on purpose in this call
                ras.attribute_context._finalize_attribute_context(proj_directive._res_opt, ac_source.at_corpus_path, self.in_document, self.in_document, None, False)

                # if polymorphic keep original source as previous state
                poly_source_set = None
                if proj_directive._is_source_polymorphic:
                    poly_source_set = ProjectionResolutionCommonUtil._get_polymorphic_source_set(proj_directive, ctx, self.source, ras)

                # Now initialize projection attribute state
                pas_set = ProjectionResolutionCommonUtil._initialize_projection_attribute_state_set(
                    proj_directive,
                    ctx,
                    ras,
                    proj_directive._is_source_polymorphic,
                    poly_source_set
                )

                proj_context = ProjectionContext(proj_directive, ras.attribute_context)
                proj_context._current_attribute_state_set = pas_set
        else:
            # A type attribute

            # Initialize projection attribute state
            pas_set = ProjectionResolutionCommonUtil._initialize_projection_attribute_state_set(
                proj_directive,
                ctx,
                ras,
                is_source_polymorphic=False,
                polymorphic_set=None
            )

            proj_context = ProjectionContext(proj_directive, ras.attribute_context)
            proj_context._current_attribute_state_set = pas_set

        is_condition_valid = False
        input_values = InputValues(proj_directive)
        is_condition_valid = ExpressionTree._evaluate_condition(self.condition, input_values)


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

            # Start with an empty list for each projection
            pas_operations = ProjectionAttributeStateSet(proj_context._current_attribute_state_set._ctx)
            
            # The attribute set that the operation will execute on
            operation_working_attribute_set = None  # type: ProjectionAttributeStateSet

            # The attribute set containing the attributes from the source
            source_attribute_set = proj_context._current_attribute_state_set  # type: ProjectionAttributeStateSet

            # Specifies if the operation is the first on the list to run
            first_operation_to_run = True
            for operation in self.operations:
                operation_condition = ExpressionTree._evaluate_condition(operation.condition, input_values)

                if not operation_condition:
                    # Skip this operation if the condition does not evaluate to true
                    continue

                # If run_sequentially is not true then all the operations will receive the source input
                # Unless the operation overwrites this behavior using the source_input property
                source_input = operation.source_input if operation.source_input is not None else not self.run_sequentially

                # If this is the first operation to run it will get the source attribute set since the operations attribute set starts empty
                if source_input or first_operation_to_run:
                    proj_context._current_attribute_state_set = source_attribute_set
                    operation_working_attribute_set = pas_operations
                else:
                    # Needs to create a copy since this set can be modified by the operation
                    proj_context._current_attribute_state_set = pas_operations._copy()
                    operation_working_attribute_set = ProjectionAttributeStateSet(proj_context._current_attribute_state_set._ctx)

                # Evaluate projections and apply to empty state
                new_pas_operations = operation._append_projection_attribute_state(proj_context, operation_working_attribute_set, ac_gen_attr_set)

                # If the operations fails or it is not implemented the projection cannot be evaluated so keep previous valid state.
                if new_pas_operations is not None:
                    first_operation_to_run = False
                    pas_operations = new_pas_operations

            # If no operation ran successfully pas_operations will be empty
            if not first_operation_to_run:
                # Finally update the current state to the projection context
                proj_context._current_attribute_state_set = pas_operations

        return proj_context

    def _extract_resolved_attributes(self, proj_ctx: 'ProjectionContext', att_ctx_under: CdmAttributeContext) -> 'ResolvedAttributeSet':
        """Create resolved attribute set based on the CurrentResolvedAttribute array"""
        resolved_attribute_set = ResolvedAttributeSet()
        resolved_attribute_set.attribute_context = att_ctx_under

        if not proj_ctx:
            logger.error(self.ctx, self._TAG, '_extract_resolved_attributes', self.at_corpus_path, CdmLogCode.ERR_PROJ_FAILED_TO_RESOLVE)
            return resolved_attribute_set

        for pas in proj_ctx._current_attribute_state_set._states:
            resolved_attribute_set.merge(pas._current_resolved_attribute)

        return resolved_attribute_set

    def _get_root_owner(self) -> 'CdmObject':
        root_owner = self  # type: CdmObject
        while True:
            root_owner = root_owner.owner
            # A projection can be inside an entity reference, so take the owner again to get the projection.
            if root_owner and root_owner.owner and root_owner.owner.object_type == CdmObjectType.PROJECTION_DEF:
                root_owner = root_owner.owner
            
            if not root_owner or root_owner.object_type != CdmObjectType.PROJECTION_DEF:
                break
        
        return root_owner
