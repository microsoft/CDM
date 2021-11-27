// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.projections;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityReference;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.*;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmOperationType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.EntityReferencePersistence;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections.*;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.util.ArrayList;
import java.util.List;

/**
 * Projection persistence
 */
public class ProjectionPersistence {
    private static final String TAG = ProjectionPersistence.class.getSimpleName();

    public static CdmProjection fromData(final CdmCorpusContext ctx, final JsonNode obj) {
        if (obj == null) {
            return null;
        }

        CdmProjection projection = ctx.getCorpus().makeObject(CdmObjectType.ProjectionDef);

        CdmEntityReference source = EntityReferencePersistence.fromData(ctx, obj.get("source"));

        if (obj.get("explanation") != null) {
            projection.setExplanation(obj.get("explanation").asText());
        }

        if (obj.get("condition") != null) {
            projection.setCondition(obj.get("condition").asText());
        }

        if (obj.get("runSequentially") != null) {
            projection.setRunSequentially(obj.get("runSequentially").asBoolean());
        }

        if (obj.get("operations") != null) {
            List<JsonNode> operationJsons = JMapper.MAP.convertValue(obj.get("operations"), new TypeReference<List<JsonNode>>() {
            });

            for (JsonNode operationJson : operationJsons) {
                String type = operationJson.get("$type").asText();
                switch (type) {
                    case "addCountAttribute":
                        CdmOperationAddCountAttribute addCountAttributeOp = OperationAddCountAttributePersistence.fromData(ctx, operationJson);
                        projection.getOperations().add(addCountAttributeOp);
                        break;
                    case "addSupportingAttribute":
                        CdmOperationAddSupportingAttribute addSupportingAttributeOp = OperationAddSupportingAttributePersistence.fromData(ctx, operationJson);
                        projection.getOperations().add(addSupportingAttributeOp);
                        break;
                    case "addTypeAttribute":
                        CdmOperationAddTypeAttribute addTypeAttributeOp = OperationAddTypeAttributePersistence.fromData(ctx, operationJson);
                        projection.getOperations().add(addTypeAttributeOp);
                        break;
                    case "excludeAttributes":
                        CdmOperationExcludeAttributes excludeAttributesOp = OperationExcludeAttributesPersistence.fromData(ctx, operationJson);
                        projection.getOperations().add(excludeAttributesOp);
                        break;
                    case "arrayExpansion":
                        CdmOperationArrayExpansion arrayExpansionOp = OperationArrayExpansionPersistence.fromData(ctx, operationJson);
                        projection.getOperations().add(arrayExpansionOp);
                        break;
                    case "combineAttributes":
                        CdmOperationCombineAttributes combineAttributesOp = OperationCombineAttributesPersistence.fromData(ctx, operationJson);
                        projection.getOperations().add(combineAttributesOp);
                        break;
                    case "renameAttributes":
                        CdmOperationRenameAttributes renameAttributesOp = OperationRenameAttributesPersistence.fromData(ctx, operationJson);
                        projection.getOperations().add(renameAttributesOp);
                        break;
                    case "replaceAsForeignKey":
                        CdmOperationReplaceAsForeignKey replaceAsForeignKeyOp = OperationReplaceAsForeignKeyPersistence.fromData(ctx, operationJson);
                        projection.getOperations().add(replaceAsForeignKeyOp);
                        break;
                    case "includeAttributes":
                        CdmOperationIncludeAttributes includeAttributesOp = OperationIncludeAttributesPersistence.fromData(ctx, operationJson);
                        projection.getOperations().add(includeAttributesOp);
                        break;
                    case "addAttributeGroup":
                        CdmOperationAddAttributeGroup addAttributeGroupOp = OperationAddAttributeGroupPersistence.fromData(ctx, operationJson);
                        projection.getOperations().add(addAttributeGroupOp);
                        break;
                    case "alterTraits":
                        CdmOperationAlterTraits addAlterTraitsOp = OperationAlterTraitsPersistence.fromData(ctx, operationJson);
                        projection.getOperations().add(addAlterTraitsOp);
                        break;
                    case "addArtifactAttribute":
                        CdmOperationAddArtifactAttribute addArtifactAttributeOp = OperationAddArtifactAttributePersistence.fromData(ctx, operationJson);
                        projection.getOperations().add(addArtifactAttributeOp);
                        break;
                    default:
                        Logger.error(ctx, TAG, "fromData", source.getAtCorpusPath(), CdmLogCode.ErrPersistProjInvalidOpsType, type);
                        break;
                }
            }
        }

        projection.setSource(source);

        return projection;
    }

    public static Projection toData(final CdmProjection instance, final ResolveOptions resOpt, final CopyOptions options) {
        if (instance == null) {
            return null;
        }

        Object source = null;
        if (instance.getSource() != null &&
                !StringUtils.isNullOrEmpty(instance.getSource().getNamedReference()) &&
                instance.getSource().getExplicitReference() == null) {
            source = instance.getSource().getNamedReference();
        } else if (instance.getSource() != null && instance.getSource().getObjectType() == CdmObjectType.EntityRef) {
            source = EntityReferencePersistence.toData(instance.getSource(), resOpt, options);
        } else if (instance.getSource() != null) {
            source = instance.getSource();
        }

        List<OperationBase> operations = null;
        if (instance.getOperations() != null && instance.getOperations().getCount() > 0) {
            operations = new ArrayList<OperationBase>();
            for (CdmOperationBase operation : instance.getOperations()) {
                switch (operation.getObjectType()) {
                    case OperationAddCountAttributeDef:
                        OperationAddCountAttribute addCountAttributeOp = OperationAddCountAttributePersistence.toData((CdmOperationAddCountAttribute) operation, resOpt, options);
                        operations.add(addCountAttributeOp);
                        break;
                    case OperationAddSupportingAttributeDef:
                        OperationAddSupportingAttribute addSupportingAttributeOp = OperationAddSupportingAttributePersistence.toData((CdmOperationAddSupportingAttribute) operation, resOpt, options);
                        operations.add(addSupportingAttributeOp);
                        break;
                    case OperationAddTypeAttributeDef:
                        OperationAddTypeAttribute addTypeAttributeOp = OperationAddTypeAttributePersistence.toData((CdmOperationAddTypeAttribute) operation, resOpt, options);
                        operations.add(addTypeAttributeOp);
                        break;
                    case OperationExcludeAttributesDef:
                        OperationExcludeAttributes excludeAttributesOp = OperationExcludeAttributesPersistence.toData((CdmOperationExcludeAttributes) operation, resOpt, options);
                        operations.add(excludeAttributesOp);
                        break;
                    case OperationArrayExpansionDef:
                        OperationArrayExpansion arrayExpansionOp = OperationArrayExpansionPersistence.toData((CdmOperationArrayExpansion) operation, resOpt, options);
                        operations.add(arrayExpansionOp);
                        break;
                    case OperationCombineAttributesDef:
                        OperationCombineAttributes combineAttributesOp = OperationCombineAttributesPersistence.toData((CdmOperationCombineAttributes) operation, resOpt, options);
                        operations.add(combineAttributesOp);
                        break;
                    case OperationRenameAttributesDef:
                        OperationRenameAttributes renameAttributesOp = OperationRenameAttributesPersistence.toData((CdmOperationRenameAttributes) operation, resOpt, options);
                        operations.add(renameAttributesOp);
                        break;
                    case OperationReplaceAsForeignKeyDef:
                        OperationReplaceAsForeignKey replaceAsForeignKeyOp = OperationReplaceAsForeignKeyPersistence.toData((CdmOperationReplaceAsForeignKey) operation, resOpt, options);
                        operations.add(replaceAsForeignKeyOp);
                        break;
                    case OperationIncludeAttributesDef:
                        OperationIncludeAttributes includeAttributesOp = OperationIncludeAttributesPersistence.toData((CdmOperationIncludeAttributes) operation, resOpt, options);
                        operations.add(includeAttributesOp);
                        break;
                    case OperationAddAttributeGroupDef:
                        OperationAddAttributeGroup addAttributeGroupOp = OperationAddAttributeGroupPersistence.toData((CdmOperationAddAttributeGroup) operation, resOpt, options);
                        operations.add(addAttributeGroupOp);
                        break;
                    case OperationAlterTraitsDef:
                        OperationAlterTraits alterTraitsOp = OperationAlterTraitsPersistence.toData((CdmOperationAlterTraits) operation, resOpt, options);
                        operations.add(alterTraitsOp);
                        break;
                    case OperationAddArtifactAttributeDef:
                        OperationAddArtifactAttribute addArtifactAttributeOp = OperationAddArtifactAttributePersistence.toData((CdmOperationAddArtifactAttribute) operation, resOpt, options);
                        operations.add(addArtifactAttributeOp);
                        break;
                    default:
                        OperationBase baseOp = new OperationBase();
                        baseOp.setType(OperationTypeConvertor.operationTypeToString(CdmOperationType.Error));
                        operations.add(baseOp);
                        break;
                }
            }
        }

        Projection obj = new Projection();
        obj.setExplanation(instance.getExplanation());
        obj.setSource(source);
        obj.setOperations(operations);
        obj.setCondition(instance.getCondition());
        obj.setRunSequentially(instance.getRunSequentially());

        return obj;
    }
}
