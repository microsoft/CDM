// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.projections;

import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmOperationReplaceAsForeignKey;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.OperationTypeConvertor;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmOperationType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.Utils;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections.OperationReplaceAsForeignKey;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

/**
 * Operation ReplaceAsForeignKey persistence
 */
public class OperationReplaceAsForeignKeyPersistence {
    public static CdmOperationReplaceAsForeignKey fromData(final CdmCorpusContext ctx, final JsonNode obj) {
        if (obj == null) {
            return null;
        }

        CdmOperationReplaceAsForeignKey replaceAsForeignKeyOp = OperationBasePersistence.fromData(ctx, CdmObjectType.OperationReplaceAsForeignKeyDef, obj);

        if (obj.get("reference") != null) {
            replaceAsForeignKeyOp.setReference(obj.get("reference").asText());
        }

        if (obj.get("replaceWith") != null) {
            replaceAsForeignKeyOp.setReplaceWith((CdmTypeAttributeDefinition) Utils.createAttribute(ctx, obj.get("replaceWith")));
        }

        return replaceAsForeignKeyOp;
    }

    public static OperationReplaceAsForeignKey toData(CdmOperationReplaceAsForeignKey instance, ResolveOptions resOpt, CopyOptions options) {
        if (instance == null) {
            return null;
        }

        OperationReplaceAsForeignKey obj = OperationBasePersistence.toData(instance, resOpt, options);
        obj.setReference(instance.getReference());
        obj.setReplaceWith(Utils.jsonForm(instance.getReplaceWith(), resOpt, options));

        return obj;
    }
}
