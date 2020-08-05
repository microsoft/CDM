// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.projections;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmOperationIncludeAttributes;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.OperationTypeConvertor;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmOperationType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections.OperationIncludeAttributes;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.util.List;

/**
 * Operation IncludeAttributes persistence
 */
public class OperationIncludeAttributesPersistence {
    public static CdmOperationIncludeAttributes fromData(final CdmCorpusContext ctx, final JsonNode obj) {
        if (obj == null) {
            return null;
        }

        CdmOperationIncludeAttributes includeAttributesOp = ctx.getCorpus().makeObject(CdmObjectType.OperationIncludeAttributesDef);

        if (obj.get("$type") != null && !StringUtils.equalsWithIgnoreCase(obj.get("$type").asText(), OperationTypeConvertor.operationTypeToString(CdmOperationType.IncludeAttributes))) {
            Logger.error(OperationIncludeAttributesPersistence.class.getSimpleName(), ctx, Logger.format("$type {0} is invalid for this operation.", obj.get("$type").asText()));
        } else {
            includeAttributesOp.setType(CdmOperationType.IncludeAttributes);
        }

        if (obj.get("explanation") != null) {
            includeAttributesOp.setExplanation(obj.get("explanation").asText());
        }

        if (obj.get("includeAttributes") != null) {
            includeAttributesOp.setIncludeAttributes(JMapper.MAP.convertValue(obj.get("includeAttributes"), new TypeReference<List<String>>() {
            }));
        }

        return includeAttributesOp;
    }

    public static OperationIncludeAttributes toData(final CdmOperationIncludeAttributes instance, final ResolveOptions resOpt, final CopyOptions options) {
        if (instance == null) {
            return null;
        }

        OperationIncludeAttributes obj = new OperationIncludeAttributes();
        obj.setType(OperationTypeConvertor.operationTypeToString(CdmOperationType.IncludeAttributes));
        obj.setExplanation(instance.getExplanation());
        obj.setIncludeAttributes(instance.getIncludeAttributes());

        return obj;
    }
}
