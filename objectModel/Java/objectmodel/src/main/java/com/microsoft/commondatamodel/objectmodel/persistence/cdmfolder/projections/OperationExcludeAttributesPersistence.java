// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.projections;

import java.util.List;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmOperationExcludeAttributes;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections.OperationExcludeAttributes;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

/**
 * Operation ExcludeAttributes persistence
 */
public class OperationExcludeAttributesPersistence {
    public static CdmOperationExcludeAttributes fromData(final CdmCorpusContext ctx, final JsonNode obj) {
        if (obj == null) {
            return null;
        }

        CdmOperationExcludeAttributes excludeAttributesOp = OperationBasePersistence.fromData(ctx, CdmObjectType.OperationExcludeAttributesDef, obj);

        if (obj.get("excludeAttributes") != null) {
            excludeAttributesOp.setExcludeAttributes(JMapper.MAP.convertValue(obj.get("excludeAttributes"), new TypeReference<List<String>>() {
            }));
        }

        return excludeAttributesOp;
    }

    public static OperationExcludeAttributes toData(final CdmOperationExcludeAttributes instance, ResolveOptions resOpt, CopyOptions options) {
        if (instance == null) {
            return null;
        }

        OperationExcludeAttributes obj = OperationBasePersistence.toData(instance, resOpt, options);
        obj.setExcludeAttributes(instance.getExcludeAttributes());

        return obj;
    }
}
