// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.projections;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmOperationExcludeAttributes;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.OperationTypeConvertor;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmOperationType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections.OperationExcludeAttributes;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.util.List;

/**
 * Operation ExcludeAttributes persistence
 */
public class OperationExcludeAttributesPersistence {
    public static CdmOperationExcludeAttributes fromData(final CdmCorpusContext ctx, final JsonNode obj) {
        if (obj == null) {
            return null;
        }

        CdmOperationExcludeAttributes excludeAttributesOp = ctx.getCorpus().makeObject(CdmObjectType.OperationExcludeAttributesDef);

        if (obj.get("$type") != null && !StringUtils.equalsWithIgnoreCase(obj.get("$type").asText(), OperationTypeConvertor.operationTypeToString(CdmOperationType.ExcludeAttributes))) {
            Logger.error(OperationExcludeAttributesPersistence.class.getSimpleName(), ctx, Logger.format("$type {0} is invalid for this operation.", obj.get("$type").asText()));
        } else {
            excludeAttributesOp.setType(CdmOperationType.ExcludeAttributes);
        }

        if (obj.get("explanation") != null) {
            excludeAttributesOp.setExplanation(obj.get("explanation").asText());
        }

        if (obj.get("excludeAttributes") != null) {
            excludeAttributesOp.setExcludeAttributes(JMapper.MAP.convertValue(obj.get("excludeAttributes"), new TypeReference<List<String>>() {
            }));
        }

        return excludeAttributesOp;
    }

    public static OperationExcludeAttributes toData(final CdmOperationExcludeAttributes instance, ResolveOptions resOpt, CopyOptions options) {
        if (instance == null) {
            return null;
        }

        OperationExcludeAttributes obj = new OperationExcludeAttributes();
        obj.setType(OperationTypeConvertor.operationTypeToString(CdmOperationType.ExcludeAttributes));
        obj.setExplanation(instance.getExplanation());
        obj.setExcludeAttributes(instance.getExcludeAttributes());

        return obj;
    }
}
