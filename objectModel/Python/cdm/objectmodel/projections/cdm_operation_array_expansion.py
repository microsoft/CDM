# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional, TYPE_CHECKING

from cdm.enums import CdmObjectType, CdmOperationType, CdmAttributeContextType
from cdm.objectmodel import CdmAttributeContext
from cdm.resolvedmodel import ResolvedAttributeSet
from cdm.resolvedmodel.projections.projection_attribute_state import ProjectionAttributeState
from cdm.utilities import logger, AttributeContextParameters
from cdm.enums import CdmLogCode
from cdm.utilities.string_utils import StringUtils

from .cdm_operation_base import CdmOperationBase

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext
    from cdm.resolvedmodel.projections.projection_attribute_state_set import ProjectionAttributeStateSet
    from cdm.resolvedmodel.projections.projection_context import ProjectionContext
    from cdm.utilities import ResolveOptions, VisitCallback


class CdmOperationArrayExpansion(CdmOperationBase):
    """Class to handle ArrayExpansion operations"""

    def __init__(self, ctx: 'CdmCorpusContext') -> None:
        super().__init__(ctx)

        self._TAG = CdmOperationArrayExpansion.__name__
        self.start_ordinal = None  # type: Optional[int]
        self.end_ordinal = None  # type: Optional[int]
        self.type = CdmOperationType.ARRAY_EXPANSION  # type: CdmOperationType


    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmOperationArrayExpansion'] = None) -> 'CdmOperationArrayExpansion':
        if not res_opt:
            res_opt = ResolveOptions(wrt_doc=self, directives=self.ctx.corpus.default_resolution_directives)

        copy = CdmOperationArrayExpansion(self.ctx) if not host else host

        copy.start_ordinal = self.start_ordinal
        copy.end_ordinal = self.end_ordinal

        self._copy_proj(res_opt, copy)
        return copy

    def get_name(self) -> str:
        return 'operationArrayExpansion'

    @property
    def object_type(self) -> 'CdmObjectType':
        return CdmObjectType.OPERATION_ARRAY_EXPANSION_DEF

    def validate(self) -> bool:
        missing_fields = []

        if self.start_ordinal is None:
            missing_fields.append('start_ordinal')

        if self.end_ordinal is None:
            missing_fields.append('end_ordinal')

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

    def _append_projection_attribute_state(self, proj_ctx: 'ProjectionContext', proj_output_set: 'ProjectionAttributeStateSet', attr_ctx: 'CdmAttributeContext') -> 'ProjectionAttributeStateSet':
        # Create a new attribute context for the operation
        attr_ctx_op_array_expansion_param = AttributeContextParameters()
        attr_ctx_op_array_expansion_param._under = attr_ctx
        attr_ctx_op_array_expansion_param._type = CdmAttributeContextType.OPERATION_ARRAY_EXPANSION
        attr_ctx_op_array_expansion_param._name = 'operation/index{}/operationArrayExpansion'.format(self._index)
        attr_ctx_op_array_expansion = CdmAttributeContext._create_child_under(proj_ctx._projection_directive._res_opt, attr_ctx_op_array_expansion_param)

        # Expansion steps start at round 0
        round = 0
        proj_attr_states_from_rounds = []

        # Ordinal validation
        if self.start_ordinal > self.end_ordinal:
            logger.warning(self.ctx, self._TAG, CdmOperationArrayExpansion._append_projection_attribute_state.__name__, self.at_corpus_path,
                           CdmLogCode.WARN_VALDN_ORDINAL_START_END_ORDER, self.start_ordinal, self.end_ordinal)
        else:
            # Ordinals should start at startOrdinal or 0, whichever is larger.
            starting_ordinal = max(0, self.start_ordinal)

            # Ordinals should end at endOrdinal or the maximum ordinal allowed (set in resolve options), whichever is smaller.
            if self.end_ordinal > proj_ctx._projection_directive._res_opt.max_ordinal_for_array_expansion:
                logger.warning(self.ctx, self._TAG, CdmOperationArrayExpansion._append_projection_attribute_state.__name__, self.at_corpus_path,
                               CdmLogCode.WARN_VALDN_MAX_ORDINAL, self.end_ordinal,
                               proj_ctx._projection_directive._res_opt.max_ordinal_for_array_expansion)

            ending_ordinal = min(proj_ctx._projection_directive._res_opt.max_ordinal_for_array_expansion, self.end_ordinal)

            # For each ordinal, create a copy of the input resolved attribute
            for i in range(starting_ordinal, ending_ordinal + 1):
                # Create a new attribute context for the round
                attr_ctx_round_param = AttributeContextParameters()
                attr_ctx_round_param._under = attr_ctx_op_array_expansion
                attr_ctx_round_param._type = CdmAttributeContextType.GENERATED_ROUND
                attr_ctx_round_param._name = '_generatedAttributeRound{}'.format(round)
                attr_ctx_round = CdmAttributeContext._create_child_under(proj_ctx._projection_directive._res_opt, attr_ctx_round_param)

                # Iterate through all the projection attribute states generated from the source's resolved attributes
                # Each projection attribute state contains a resolved attribute that it is corresponding to
                for current_PAS in proj_ctx._current_attribute_state_set._states:
                    # Create a new attribute context for the expanded attribute with the current ordinal
                    attr_ctx_expanded_attr_param = AttributeContextParameters()
                    attr_ctx_expanded_attr_param._under = attr_ctx_round
                    attr_ctx_expanded_attr_param._type = CdmAttributeContextType.ATTRIBUTE_DEFINITION
                    attr_ctx_expanded_attr_param._name = '{}@{}'.format(current_PAS._current_resolved_attribute.resolved_name, i)
                    attr_ctx_expanded_attr = CdmAttributeContext._create_child_under(proj_ctx._projection_directive._res_opt, attr_ctx_expanded_attr_param)

                    if isinstance(current_PAS._current_resolved_attribute.target, ResolvedAttributeSet):
                        logger.error(self.ctx, self._TAG, '_append_projection_attribute_state', self.at_corpus_path, CdmLogCode.ERR_PROJ_UNSUPPORTED_ATTR_GROUPS)
                        proj_attr_states_from_rounds.clear()
                        break

                    # Create a new resolved attribute for the expanded attribute
                    new_res_attr = self._create_new_resolved_attribute(proj_ctx, attr_ctx_expanded_attr, current_PAS._current_resolved_attribute, current_PAS._current_resolved_attribute.resolved_name)

                    # Create a projection attribute state for the expanded attribute
                    new_PAS = ProjectionAttributeState(proj_output_set._ctx)
                    new_PAS._current_resolved_attribute = new_res_attr
                    new_PAS._previous_state_list = [current_PAS]
                    new_PAS._ordinal = i

                    proj_attr_states_from_rounds.append(new_PAS)

                if i == ending_ordinal:
                    break

                # Increment the round
                round += 1

        if len(proj_attr_states_from_rounds) == 0:
            # No rounds were produced from the array expansion - input passes through
            for pas in proj_ctx._current_attribute_state_set._states:
                proj_output_set._add(pas)
        else:
            # Add all the projection attribute states containing the expanded attributes to the output
            for pas in proj_attr_states_from_rounds:
                proj_output_set._add(pas)

        return proj_output_set
