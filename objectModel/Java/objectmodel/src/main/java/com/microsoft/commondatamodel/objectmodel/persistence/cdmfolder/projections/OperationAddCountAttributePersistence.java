// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.projections;

import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmOperationAddCountAttribute;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.Utils;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections.OperationAddCountAttribute;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

/**
 * Operation AddCountAttribute persistence
 */
public class OperationAddCountAttributePersistence {
    public static CdmOperationAddCountAttribute fromData(final CdmCorpusContext ctx, final JsonNode obj) {
        if (obj == null) {
            return null;
        }

        CdmOperationAddCountAttribute addCountAttributeOp = OperationBasePersistence.fromData(ctx, CdmObjectType.OperationAddCountAttributeDef, obj);

        if (obj.get("countAttribute") != null) {
            addCountAttributeOp.setCountAttribute((CdmTypeAttributeDefinition) Utils.createAttribute(ctx, obj.get("countAttribute")));
        }

        return addCountAttributeOp;
    }

    public static OperationAddCountAttribute toData(final CdmOperationAddCountAttribute instance, final ResolveOptions resOpt, final CopyOptions options) {
        if (instance == null) {
            return null;
        }

        OperationAddCountAttribute obj = OperationBasePersistence.toData(instance, resOpt, options);
        obj.setCountAttribute(Utils.jsonForm(instance.getCountAttribute(), resOpt, options));

        return obj;
    }
}
