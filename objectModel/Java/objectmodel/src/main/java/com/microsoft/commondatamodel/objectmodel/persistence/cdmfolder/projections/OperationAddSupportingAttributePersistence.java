// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.projections;

import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmOperationAddSupportingAttribute;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.OperationTypeConvertor;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmOperationType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.Utils;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections.OperationAddSupportingAttribute;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

/**
 * Operation AddSupportingAttribute persistence
 */
public class OperationAddSupportingAttributePersistence {
    public static CdmOperationAddSupportingAttribute fromData(final CdmCorpusContext ctx, final JsonNode obj) {
        if (obj == null) {
            return null;
        }

        CdmOperationAddSupportingAttribute addSupportingAttributeOp = ctx.getCorpus().makeObject(CdmObjectType.OperationAddSupportingAttributeDef);

        if (obj.get("$type") != null && !StringUtils.equalsWithIgnoreCase(obj.get("$type").asText(), OperationTypeConvertor.operationTypeToString(CdmOperationType.AddSupportingAttribute))) {
            Logger.error(OperationAddSupportingAttributePersistence.class.getSimpleName(), ctx, Logger.format("$type {0} is invalid for this operation.", obj.get("$type").asText()));
        } else {
            addSupportingAttributeOp.setType(CdmOperationType.AddSupportingAttribute);
        }

        if (obj.get("explanation") != null) {
            addSupportingAttributeOp.setExplanation(obj.get("explanation").asText());
        }

        if (obj.get("supportingAttribute") != null) {
            addSupportingAttributeOp.setSupportingAttribute((CdmTypeAttributeDefinition) Utils.createAttribute(ctx, obj.get("supportingAttribute")));
        }

        return addSupportingAttributeOp;
    }

    public static OperationAddSupportingAttribute toData(final CdmOperationAddSupportingAttribute instance, final ResolveOptions resOpt, final CopyOptions options) {
        if (instance == null) {
            return null;
        }

        OperationAddSupportingAttribute obj = new OperationAddSupportingAttribute();
        obj.setType(OperationTypeConvertor.operationTypeToString(CdmOperationType.AddSupportingAttribute));
        obj.setExplanation(instance.getExplanation());
        obj.setSupportingAttribute(Utils.jsonForm(instance.getSupportingAttribute(), resOpt, options));

        return obj;
    }
}
