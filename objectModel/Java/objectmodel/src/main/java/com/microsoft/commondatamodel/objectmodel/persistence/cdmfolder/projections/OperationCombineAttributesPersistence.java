// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.projections;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmOperationCombineAttributes;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.OperationTypeConvertor;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmOperationType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.Utils;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections.OperationCombineAttributes;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.util.List;

/**
 * Operation CombineAttributes persistence
 */
public class OperationCombineAttributesPersistence {
    public static CdmOperationCombineAttributes fromData(final CdmCorpusContext ctx, final JsonNode obj) {
        if (obj == null) {
            return null;
        }

        CdmOperationCombineAttributes combineAttributesOp = ctx.getCorpus().makeObject(CdmObjectType.OperationCombineAttributesDef);

        if (obj.get("$type") != null && !StringUtils.equalsWithIgnoreCase(obj.get("$type").asText(), OperationTypeConvertor.operationTypeToString(CdmOperationType.CombineAttributes))) {
            Logger.error(OperationCombineAttributesPersistence.class.getSimpleName(), ctx, Logger.format("$type {0} is invalid for this operation.", obj.get("$type").asText()));
        } else {
            combineAttributesOp.setType(CdmOperationType.CombineAttributes);
        }

        if (obj.get("explanation") != null) {
            combineAttributesOp.setExplanation(obj.get("explanation").asText());
        }

        combineAttributesOp.setSelect(obj.get("select") == null ? null : JMapper.MAP.convertValue(obj.get("select"), new TypeReference<List<String>>() {
        }));
        combineAttributesOp.setMergeInto((CdmTypeAttributeDefinition) Utils.createAttribute(ctx, obj.get("mergeInto")));

        return combineAttributesOp;
    }

    public static OperationCombineAttributes toData(CdmOperationCombineAttributes instance, ResolveOptions resOpt, CopyOptions options) {
        if (instance == null) {
            return null;
        }

        OperationCombineAttributes obj = new OperationCombineAttributes();
        obj.setType(OperationTypeConvertor.operationTypeToString(CdmOperationType.CombineAttributes));
        obj.setExplanation(instance.getExplanation());
        obj.setSelect(instance.getSelect());
        obj.setMergeInto(Utils.jsonForm(instance.getMergeInto(), resOpt, options));

        return obj;
    }
}
