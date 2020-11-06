// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.projections;

import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmOperationAddAttributeGroup;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.OperationTypeConvertor;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmOperationType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections.OperationAddAttributeGroup;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

/**
 * Operation AddAttributeGroup persistence
 */
public class OperationAddAttributeGroupPersistence {
    public static CdmOperationAddAttributeGroup fromData(final CdmCorpusContext ctx, final JsonNode obj) {
        if (obj == null) {
            return null;
        }

        CdmOperationAddAttributeGroup addAttributeGroupOp = ctx.getCorpus().makeObject(CdmObjectType.OperationAddAttributeGroupDef);

        if (obj.get("$type") != null && !StringUtils.equalsWithIgnoreCase(obj.get("$type").asText(), OperationTypeConvertor.operationTypeToString(CdmOperationType.AddAttributeGroup))) {
            Logger.error(OperationAddAttributeGroupPersistence.class.getSimpleName(), ctx, Logger.format("$type {0} is invalid for this operation.", obj.get("$type").asText()));
        } else {
            addAttributeGroupOp.setType(CdmOperationType.AddAttributeGroup);
        }

        if (obj.get("attributeGroupName") != null) {
            addAttributeGroupOp.setAttributeGroupName(obj.get("attributeGroupName").asText());
        }

        if (obj.get("explanation") != null) {
            addAttributeGroupOp.setExplanation(obj.get("explanation").asText());
        }

        return addAttributeGroupOp;
    }

    public static OperationAddAttributeGroup toData(final CdmOperationAddAttributeGroup instance, final ResolveOptions resOpt, final CopyOptions options) {
        if (instance == null) {
            return null;
        }

        OperationAddAttributeGroup obj = new OperationAddAttributeGroup();
        obj.setType(OperationTypeConvertor.operationTypeToString(CdmOperationType.AddAttributeGroup));
        obj.setAttributeGroupName(instance.getAttributeGroupName());
        obj.setExplanation(instance.getExplanation());

        return obj;
    }
}
