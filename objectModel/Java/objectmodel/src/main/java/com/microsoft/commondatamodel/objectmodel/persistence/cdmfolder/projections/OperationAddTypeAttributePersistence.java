// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.projections;

import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmOperationAddTypeAttribute;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.OperationTypeConvertor;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmOperationType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.Utils;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections.OperationAddTypeAttribute;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

/**
 * Operation AddTypeAttribute persistence
 */
public class OperationAddTypeAttributePersistence {
    public static CdmOperationAddTypeAttribute fromData(final CdmCorpusContext ctx, final JsonNode obj) {
        if (obj == null) {
            return null;
        }

        CdmOperationAddTypeAttribute addTypeAttributeOp = ctx.getCorpus().makeObject(CdmObjectType.OperationAddTypeAttributeDef);

        if (obj.get("$type") != null && !StringUtils.equalsWithIgnoreCase(obj.get("$type").asText(), OperationTypeConvertor.operationTypeToString(CdmOperationType.AddTypeAttribute))) {
            Logger.error(OperationAddTypeAttributePersistence.class.getSimpleName(), ctx, Logger.format("$type {0} is invalid for this operation.", obj.get("$type").asText()));
        } else {
            addTypeAttributeOp.setType(CdmOperationType.AddTypeAttribute);
        }

        if (obj.get("explanation") != null) {
            addTypeAttributeOp.setExplanation(obj.get("explanation").asText());
        }

        if (obj.get("typeAttribute") != null) {
            addTypeAttributeOp.setTypeAttribute((CdmTypeAttributeDefinition) Utils.createAttribute(ctx, obj.get("typeAttribute")));
        }

        return addTypeAttributeOp;
    }

    public static OperationAddTypeAttribute toData(final CdmOperationAddTypeAttribute instance, final ResolveOptions resOpt, final CopyOptions options) {
        if (instance == null) {
            return null;
        }

        OperationAddTypeAttribute obj = new OperationAddTypeAttribute();
        obj.setType(OperationTypeConvertor.operationTypeToString(CdmOperationType.AddTypeAttribute));
        obj.setExplanation(instance.getExplanation());
        obj.setTypeAttribute(Utils.jsonForm(instance.getTypeAttribute(), resOpt, options));

        return obj;
    }
}
