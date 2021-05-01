# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import TYPE_CHECKING, Optional

from cdm.enums import CdmObjectType, CdmOperationType, CdmAttributeContextType
from cdm.objectmodel import CdmAttributeContext
from cdm.resolvedmodel.projections.projection_attribute_state import ProjectionAttributeState
from cdm.resolvedmodel.projections.projection_resolution_common_util import ProjectionResolutionCommonUtil
from cdm.utilities import logger, AttributeContextParameters
from cdm.enums import CdmLogCode
from cdm.utilities.string_utils import StringUtils

from .cdm_operation_base import CdmOperationBase

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmTypeAttributeDefinition
    from cdm.resolvedmodel import ResolvedAttribute
    from cdm.utilities import VisitCallback, ResolveOptions

    from cdm.resolvedmodel.projections.projection_attribute_state_set import ProjectionAttributeStateSet
    from cdm.resolvedmodel.projections.projection_context import ProjectionContext


class CdmOperationReplaceAsForeignKey(CdmOperationBase):
    """Class to handle ReplaceAsForeignKey operations"""

    def __init__(self, ctx: 'CdmCorpusContext') -> None:
        super().__init__(ctx)

        self._TAG = CdmOperationReplaceAsForeignKey.__name__
        self.reference = None  # type: str
        self.replace_with = None  # type: CdmTypeAttributeDefinition
        self.type = CdmOperationType.REPLACE_AS_FOREIGN_KEY  # type: CdmOperationType

    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmOperationReplaceAsForeignKey'] = None) -> 'CdmOperationReplaceAsForeignKey':
        copy = CdmOperationReplaceAsForeignKey(self.ctx)
        copy.reference = self.reference
        copy.replace_with = self.replace_with.copy()

        return copy

    def get_name(self) -> str:
        return 'operationReplaceAsForeignKey'

    @property
    def object_type(self) -> 'CdmObjectType':
        return CdmObjectType.OPERATION_REPLACE_AS_FOREIGN_KEY_DEF

    def validate(self) -> bool:
        missing_fields = []

        if not bool(self.reference):
            missing_fields.append('reference')

        if not bool(self.replace_with):
            missing_fields.append('replace_with')

        if len(missing_fields) > 0:
            logger.error(self.ctx, self._TAG, 'validate', self.at_corpus_path, CdmLogCode.ERR_VALDN_INTEGRITY_CHECK_FAILURE, self.at_corpus_path, ', '.join(map(lambda s: '\'' + s + '\'', missing_fields)))
            return False

        return True

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        path = ''
        if not self.ctx.corpus._block_declared_path_changes:
            path = self._declared_path
            if not path:
                path = path_from + 'operationReplaceAsForeignKey'
                self._declared_path = path

        if pre_children and pre_children(self, path):
            return False

        if self.replace_with:
            if self.replace_with.visit(path_from + 'foreignKeyAttribute/', pre_children, post_children):
                return True

        if post_children and post_children(self, path):
            return True

        return False

    def _append_projection_attribute_state(self, proj_ctx: 'ProjectionContext', proj_output_set: 'ProjectionAttributeStateSet', attr_ctx: 'CdmAttributeContext') -> 'ProjectionAttributeStateSet':
        # Create new attribute context for the operation
        attr_ctx_op_fk_param = AttributeContextParameters()
        attr_ctx_op_fk_param._under = attr_ctx
        attr_ctx_op_fk_param._type = CdmAttributeContextType.OPERATION_REPLACE_AS_FOREIGN_KEY
        attr_ctx_op_fk_param._name = 'operation/index{}/operationReplaceAsForeignKey'.format(self._index)
        attr_ctx_op_fk = CdmAttributeContext._create_child_under(proj_ctx._projection_directive._res_opt, attr_ctx_op_fk_param)

        # Create new attribute context for the AddedAttributeIdentity
        attr_ctx_fk_param = AttributeContextParameters()
        attr_ctx_fk_param._under = attr_ctx_op_fk
        attr_ctx_fk_param._type = CdmAttributeContextType.ADDED_ATTRIBUTE_IDENTITY
        attr_ctx_fk_param._name = '_foreignKey'
        attr_ctx_FK = CdmAttributeContext._create_child_under(proj_ctx._projection_directive._res_opt, attr_ctx_fk_param)

        # get the added attribute and applied trait
        sub_FK = self.replace_with
        add_trait = ['is.linkedEntity.identifier']

        # Create new resolved attribute, set the new attribute as target, and apply "is.linkedEntity.identifier" trait
        res_attr_new_FK = self._create_new_resolved_attribute(proj_ctx, attr_ctx_FK, sub_FK, None, add_trait)

        outputFromOpPasSet = self._create_new_projection_attribute_state_set(proj_ctx, proj_output_set, res_attr_new_FK, self.reference)

        return outputFromOpPasSet

    @staticmethod
    def _create_new_projection_attribute_state_set(
            proj_ctx: 'ProjectionContext',
            proj_output_set: 'ProjectionAttributeStateSet',
            new_res_attr_FK: 'ResolvedAttribute',
            ref_attr_name: str
    ) -> 'ProjectionAttributeStateSet':
        pas_list = ProjectionResolutionCommonUtil._get_leaf_list(proj_ctx, ref_attr_name)
        source_entity = proj_ctx._projection_directive._original_source_entity_attribute_name

        if not source_entity:
            logger.warning(proj_output_set._ctx, CdmOperationReplaceAsForeignKey.__name__, \
                CdmOperationReplaceAsForeignKey._create_new_projection_attribute_state_set.__name__, None, CdmLogCode.WARN_PROJ_FK_WITHOUT_SOURCE_ENTITY, ref_attr_name)

        if pas_list is not None:
            # update the new foreign key resolved attribute with trait param with reference details
            reqd_trait = new_res_attr_FK.resolved_traits.find(proj_ctx._projection_directive._res_opt, 'is.linkedEntity.identifier')
            if reqd_trait and source_entity:
                trait_param_ent_ref = ProjectionResolutionCommonUtil._create_foreign_key_linked_entity_identifier_trait_parameter(proj_ctx._projection_directive, proj_output_set._ctx.corpus, pas_list)
                reqd_trait.parameter_values.update_parameter_value(proj_ctx._projection_directive._res_opt, 'entityReferences', trait_param_ent_ref)

            # Create new output projection attribute state set for FK and add prevPas as previous state set
            new_proj_attr_state_FK = ProjectionAttributeState(proj_output_set._ctx)
            new_proj_attr_state_FK._current_resolved_attribute = new_res_attr_FK
            new_proj_attr_state_FK._previous_state_list = pas_list

            proj_output_set._add(new_proj_attr_state_FK)
        else:
            # Log error & return proj_output_set without any change
            logger.error(proj_output_set._ctx, CdmOperationReplaceAsForeignKey.__name__, CdmOperationReplaceAsForeignKey._create_new_projection_attribute_state_set.__name__, None, CdmLogCode.ERR_PROJ_REF_ATTR_STATE_FAILURE, ref_attr_name)
        return proj_output_set
