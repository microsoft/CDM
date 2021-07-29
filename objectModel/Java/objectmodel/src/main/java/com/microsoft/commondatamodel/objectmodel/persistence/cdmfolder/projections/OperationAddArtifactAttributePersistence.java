// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.projections;

import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmOperationAddArtifactAttribute;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.Utils;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections.OperationAddArtifactAttribute;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

/**
 * Operation AddArtifactAttribute persistence
 */
public class OperationAddArtifactAttributePersistence {
    public static CdmOperationAddArtifactAttribute fromData(final CdmCorpusContext ctx, final JsonNode obj) {
        if (obj == null) {
            return null;
        }

        CdmOperationAddArtifactAttribute addArtifactAttributeOp = OperationBasePersistence.fromData(ctx, CdmObjectType.OperationAddArtifactAttributeDef, obj);
        if (obj.get("newAttribute") != null) {
            addArtifactAttributeOp.setNewAttribute(Utils.createAttribute(ctx, obj.get("newAttribute")));
        }

        if (obj.get("insertAtTop") != null) {
            addArtifactAttributeOp.setInsertAtTop(obj.get("insertAtTop").asBoolean());
        }

        return addArtifactAttributeOp;
    }

    public static OperationAddArtifactAttribute toData(final CdmOperationAddArtifactAttribute instance, ResolveOptions resOpt, CopyOptions options) {
        if (instance == null) {
            return null;
        }

        OperationAddArtifactAttribute obj = OperationBasePersistence.toData(instance, resOpt, options);
        obj.setNewAttribute(Utils.jsonForm(instance.getNewAttribute(), resOpt, options));
        obj.setInsertAtTop(instance.getInsertAtTop());

        return obj;
    }
}
