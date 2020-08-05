// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.projections;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmOperationRenameAttributes;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.OperationTypeConvertor;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmOperationType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections.OperationRenameAttributes;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

/**
 * Operation RenameAttributes persistence
 */
public class OperationRenameAttributesPersistence {
    public static CdmOperationRenameAttributes fromData(final CdmCorpusContext ctx, final JsonNode obj) {
        if (obj == null) {
            return null;
        }

        CdmOperationRenameAttributes renameAttributesOp = ctx.getCorpus().makeObject(CdmObjectType.OperationRenameAttributesDef);

        if (obj.get("$type") != null && !StringUtils.equalsWithIgnoreCase(obj.get("$type").asText(), OperationTypeConvertor.operationTypeToString(CdmOperationType.RenameAttributes))) {
            Logger.error(OperationRenameAttributesPersistence.class.getSimpleName(), ctx, Logger.format("$type {0} is invalid for this operation.", obj.get("$type").asText()));
        } else {
            renameAttributesOp.setType(CdmOperationType.RenameAttributes);
        }

        if (obj.get("explanation") != null) {
            renameAttributesOp.setExplanation(obj.get("explanation").asText());
        }

        if (obj.get("renameFormat") != null) {
            renameAttributesOp.setRenameFormat(obj.get("renameFormat").asText());
        }
        renameAttributesOp.setApplyTo(obj.get("applyTo") == null ? null : JMapper.MAP.convertValue(obj.get("applyTo"), new TypeReference<Object>() {
        }));

        return renameAttributesOp;
    }

    public static OperationRenameAttributes toData(final CdmOperationRenameAttributes instance, final ResolveOptions resOpt, final CopyOptions options) {
        if (instance == null) {
            return null;
        }

        OperationRenameAttributes obj = new OperationRenameAttributes();
        obj.setType(OperationTypeConvertor.operationTypeToString(CdmOperationType.RenameAttributes));
        obj.setExplanation(instance.getExplanation());
        obj.setRenameFormat(instance.getRenameFormat());
        obj.setApplyTo(instance.getApplyTo());

        return obj;
    }
}
