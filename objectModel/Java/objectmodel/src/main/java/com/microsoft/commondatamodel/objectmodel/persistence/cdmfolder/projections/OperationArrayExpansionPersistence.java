// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.projections;

import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmOperationArrayExpansion;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.OperationTypeConvertor;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmOperationType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections.OperationArrayExpansion;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

/**
 * Operation ArrayExpansion persistence
 */
public class OperationArrayExpansionPersistence {
    public static CdmOperationArrayExpansion fromData(final CdmCorpusContext ctx, final JsonNode obj) {
        if (obj == null) {
            return null;
        }

        CdmOperationArrayExpansion arrayExpansionOp = ctx.getCorpus().makeObject(CdmObjectType.OperationArrayExpansionDef);

        if (obj.get("$type") != null && !StringUtils.equalsWithIgnoreCase(obj.get("$type").asText(), OperationTypeConvertor.operationTypeToString(CdmOperationType.ArrayExpansion))) {
            Logger.error(OperationArrayExpansionPersistence.class.getSimpleName(), ctx, Logger.format("$type {0} is invalid for this operation.", obj.get("$type").asText()));
        } else {
            arrayExpansionOp.setType(CdmOperationType.ArrayExpansion);
        }

        if (obj.get("explanation") != null) {
            arrayExpansionOp.setExplanation(obj.get("explanation").asText());
        }

        arrayExpansionOp.setStartOrdinal(obj.get("startOrdinal") == null ? null : obj.get("startOrdinal").asInt());
        arrayExpansionOp.setEndOrdinal(obj.get("endOrdinal") == null ? null : obj.get("endOrdinal").asInt());

        return arrayExpansionOp;
    }

    public static OperationArrayExpansion toData(final CdmOperationArrayExpansion instance, ResolveOptions resOpt, CopyOptions options) {
        if (instance == null) {
            return null;
        }

        OperationArrayExpansion obj = new OperationArrayExpansion();
        obj.setType(OperationTypeConvertor.operationTypeToString(CdmOperationType.ArrayExpansion));
        obj.setExplanation(instance.getExplanation());
        obj.setStartOrdinal(instance.getStartOrdinal());
        obj.setEndOrdinal(instance.getEndOrdinal());

        return obj;
    }
}
