// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.projections;

import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmOperationAddSupportingAttribute;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.Utils;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections.OperationAddSupportingAttribute;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

/**
 * Operation AddSupportingAttribute persistence
 */
public class OperationAddSupportingAttributePersistence {
    public static CdmOperationAddSupportingAttribute fromData(final CdmCorpusContext ctx, final JsonNode obj) {
        if (obj == null) {
            return null;
        }

        CdmOperationAddSupportingAttribute addSupportingAttributeOp = OperationBasePersistence.fromData(ctx, CdmObjectType.OperationAddSupportingAttributeDef, obj);

        if (obj.get("supportingAttribute") != null) {
            addSupportingAttributeOp.setSupportingAttribute((CdmTypeAttributeDefinition) Utils.createAttribute(ctx, obj.get("supportingAttribute")));
        }

        return addSupportingAttributeOp;
    }

    public static OperationAddSupportingAttribute toData(final CdmOperationAddSupportingAttribute instance, final ResolveOptions resOpt, final CopyOptions options) {
        if (instance == null) {
            return null;
        }

        OperationAddSupportingAttribute obj = OperationBasePersistence.toData(instance, resOpt, options);
        obj.setSupportingAttribute(Utils.jsonForm(instance.getSupportingAttribute(), resOpt, options));

        return obj;
    }
}
