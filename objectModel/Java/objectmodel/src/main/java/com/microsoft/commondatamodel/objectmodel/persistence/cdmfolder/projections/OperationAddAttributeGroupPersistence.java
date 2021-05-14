// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.projections;

import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmOperationAddAttributeGroup;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections.OperationAddAttributeGroup;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

/**
 * Operation AddAttributeGroup persistence
 */
public class OperationAddAttributeGroupPersistence {
    public static CdmOperationAddAttributeGroup fromData(final CdmCorpusContext ctx, final JsonNode obj) {
        if (obj == null) {
            return null;
        }

        CdmOperationAddAttributeGroup addAttributeGroupOp = OperationBasePersistence.fromData(ctx, CdmObjectType.OperationAddAttributeGroupDef, obj);

        if (obj.get("attributeGroupName") != null) {
            addAttributeGroupOp.setAttributeGroupName(obj.get("attributeGroupName").asText());
        }

        return addAttributeGroupOp;
    }

    public static OperationAddAttributeGroup toData(final CdmOperationAddAttributeGroup instance, final ResolveOptions resOpt, final CopyOptions options) {
        if (instance == null) {
            return null;
        }

        OperationAddAttributeGroup obj = OperationBasePersistence.toData(instance, resOpt, options);
        obj.setAttributeGroupName(instance.getAttributeGroupName());

        return obj;
    }
}
