# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import TYPE_CHECKING, Union

from cdm.enums import CdmObjectType, CdmLogCode
from cdm.enums.cdm_operation_type import CdmOperationType, OperationTypeConvertor
from cdm.objectmodel import CdmOperationBase, CdmEntityReference
from cdm.persistence.cdmfolder.projections.operation_add_attribute_group_persistence import \
    OperationAddAttributeGroupPersistence
from cdm.persistence.cdmfolder.projections.operation_add_count_attribute_persistence import OperationAddCountAttributePersistence
from cdm.persistence.cdmfolder.projections.operation_add_supporting_persistence import OperationAddSupportingAttributePersistence
from cdm.persistence.cdmfolder.projections.operation_add_type_persistence import OperationAddTypeAttributePersistence
from cdm.persistence.cdmfolder.projections.operation_exclude_attributes_persistence import OperationExcludeAttributesPersistence
from cdm.persistence.cdmfolder.projections.operation_array_expansion_persistence import OperationArrayExpansionPersistence
from cdm.persistence.cdmfolder.projections.operation_combine_attributes_persistence import \
    OperationCombineAttributesPersistence
from cdm.persistence.cdmfolder.projections.operation_rename_attributes_persistence import OperationRenameAttributesPersistence
from cdm.persistence.cdmfolder.projections.operation_replace_as_foreign_key_persistence import \
    OperationReplaceAsForeignKeyPersistence
from cdm.persistence.cdmfolder.projections.operation_include_attributes_persistence import OperationIncludeAttributesPersistence

from cdm.persistence.cdmfolder.types import Projection, EntityReference
from cdm.persistence.cdmfolder.types.projections.operation_base import OperationBase
from cdm.utilities.logging import logger

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmProjection
    from cdm.utilities import ResolveOptions, CopyOptions

_TAG = 'ProjectionPersistence'


class ProjectionPersistence:
    """Projection persistence"""

    @staticmethod
    def from_data(ctx: 'CdmCorpusContext', data: Union[str, 'EntityReference', 'Projection']) -> 'CdmProjection':
        from cdm.persistence.cdmfolder.entity_reference_persistence import EntityReferencePersistence

        if not data:
            return None

        projection = ctx.corpus.make_object(CdmObjectType.PROJECTION_DEF)

        source = EntityReferencePersistence.from_data(ctx, data.get('source'))

        if data.explanation:
            projection.explanation = data.explanation

        if data.condition:
            projection.condition = data.condition

        projection.run_sequentially = data.runSequentially

        if data.operations is not None:
            operation_jsons = data.operations
            for operation_json in operation_jsons:
                type = operation_json.get('$type')

                if type == 'addCountAttribute':
                    add_count_attribute_op = OperationAddCountAttributePersistence.from_data(ctx, operation_json)
                    projection.operations.append(add_count_attribute_op)
                elif type == 'addSupportingAttribute':
                    add_supporting_attribute_op = OperationAddSupportingAttributePersistence.from_data(ctx, operation_json)
                    projection.operations.append(add_supporting_attribute_op)
                elif type == 'addTypeAttribute':
                    add_type_attribute_op = OperationAddTypeAttributePersistence.from_data(ctx, operation_json)
                    projection.operations.append(add_type_attribute_op)
                elif type == 'excludeAttributes':
                    exclude_attributes_op = OperationExcludeAttributesPersistence.from_data(ctx, operation_json)
                    projection.operations.append(exclude_attributes_op)
                elif type == 'arrayExpansion':
                    array_expansion_op = OperationArrayExpansionPersistence.from_data(ctx, operation_json)
                    projection.operations.append(array_expansion_op)
                elif type == 'combineAttributes':
                    combine_attributes_op = OperationCombineAttributesPersistence.from_data(ctx, operation_json)
                    projection.operations.append(combine_attributes_op)
                elif type == 'renameAttributes':
                    rename_attributes_op = OperationRenameAttributesPersistence.from_data(ctx, operation_json)
                    projection.operations.append(rename_attributes_op)
                elif type == 'replaceAsForeignKey':
                    replace_as_foreign_key_op = OperationReplaceAsForeignKeyPersistence.from_data(ctx, operation_json)
                    projection.operations.append(replace_as_foreign_key_op)
                elif type == 'includeAttributes':
                    include_attributes_op = OperationIncludeAttributesPersistence.from_data(ctx, operation_json)
                    projection.operations.append(include_attributes_op)
                elif type == 'addAttributeGroup':
                    add_attribute_group_op = OperationAddAttributeGroupPersistence.from_data(ctx, operation_json)
                    projection.operations.append(add_attribute_group_op)
                else:
                    logger.error(ctx, _TAG, ProjectionPersistence.from_data.__name__, None, CdmLogCode.ERR_PERSIST_PROJ_INVALID_OPS_TYPE, type)

        projection.source = source

        return projection

    @staticmethod
    def to_data(instance: 'CdmProjection', res_opt: 'ResolveOptions', options: 'CopyOptions') -> 'Projection':
        from cdm.persistence.cdmfolder.entity_reference_persistence import EntityReferencePersistence

        if not instance:
            return None

        if instance.source and isinstance(instance.source, str):
            source = instance.source
        elif instance.source and instance.source.named_reference and instance.source.explicit_reference == None:
            source = instance.source.named_reference
        elif instance.source and isinstance(instance.source, CdmEntityReference):
            source = EntityReferencePersistence.to_data(instance.source, res_opt, options)

        operations = None
        if instance.operations and len(instance.operations) > 0:
            operations = []
            for operation in instance.operations:
                if operation.object_type == CdmObjectType.OPERATION_ADD_COUNT_ATTRIBUTE_DEF:
                    add_count_attribute_op = OperationAddCountAttributePersistence.to_data(operation, res_opt, options)
                    operations.append(add_count_attribute_op)
                elif operation.object_type == CdmObjectType.OPERATION_ADD_SUPPORTING_ATTRIBUTE_DEF:
                    add_supporting_attribute_op = OperationAddSupportingAttributePersistence.to_data(operation, res_opt, options)
                    operations.append(add_supporting_attribute_op)
                elif operation.object_type == CdmObjectType.OPERATION_ADD_TYPE_ATTRIBUTE_DEF:
                    add_type_attribute_op = OperationAddTypeAttributePersistence.to_data(operation, res_opt, options)
                    operations.append(add_type_attribute_op)
                elif operation.object_type == CdmObjectType.OPERATION_EXCLUDE_ATTRIBUTES_DEF:
                    exclude_attributes_op = OperationExcludeAttributesPersistence.to_data(operation, res_opt, options)
                    operations.append(exclude_attributes_op)
                elif operation.object_type == CdmObjectType.OPERATION_ARRAY_EXPANSION_DEF:
                    array_expansion_op = OperationArrayExpansionPersistence.to_data(operation, res_opt, options)
                    operations.append(array_expansion_op)
                elif operation.object_type == CdmObjectType.OPERATION_COMBINE_ATTRIBUTES_DEF:
                    combine_attributes_op = OperationCombineAttributesPersistence.to_data(operation, res_opt, options)
                    operations.append(combine_attributes_op)
                elif operation.object_type == CdmObjectType.OPERATION_RENAME_ATTRIBUTES_DEF:
                    rename_attributes_op = OperationRenameAttributesPersistence.to_data(operation, res_opt, options)
                    operations.append(rename_attributes_op)
                elif operation.object_type == CdmObjectType.OPERATION_REPLACE_AS_FOREIGN_KEY_DEF:
                    replace_as_foreign_key_op = OperationReplaceAsForeignKeyPersistence.to_data(operation, res_opt, options)
                    operations.append(replace_as_foreign_key_op)
                elif operation.object_type == CdmObjectType.OPERATION_INCLUDE_ATTRIBUTES_DEF:
                    include_attributes_op = OperationIncludeAttributesPersistence.to_data(operation, res_opt, options)
                    operations.append(include_attributes_op)
                elif operation.object_type == CdmObjectType.OPERATION_ADD_ATTRIBUTE_GROUP_DEF:
                    add_attribute_group_op = OperationAddAttributeGroupPersistence.to_data(operation, res_opt, options)
                    operations.append(add_attribute_group_op)
                else:
                    base_op = OperationBase()
                    base_op.type = OperationTypeConvertor._operation_type_to_string(CdmOperationType.ERROR)
                    operations.append(base_op)

        obj = Projection()
        obj.explanation = instance.explanation
        obj.source = source
        obj.operations = operations
        obj.condition = instance.condition
        obj.runSequentially = instance.run_sequentially

        return obj
