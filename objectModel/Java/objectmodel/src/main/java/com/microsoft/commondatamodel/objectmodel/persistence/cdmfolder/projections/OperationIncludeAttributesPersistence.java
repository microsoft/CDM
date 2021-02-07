// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.projections;

import java.util.List;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmOperationIncludeAttributes;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections.OperationIncludeAttributes;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

/**
 * Operation IncludeAttributes persistence
 */
public class OperationIncludeAttributesPersistence {
    public static CdmOperationIncludeAttributes fromData(final CdmCorpusContext ctx, final JsonNode obj) {
        if (obj == null) {
            return null;
        }

        CdmOperationIncludeAttributes includeAttributesOp = OperationBasePersistence.fromData(ctx, CdmObjectType.OperationIncludeAttributesDef, obj);

        if (obj.get("includeAttributes") != null) {
            includeAttributesOp.setIncludeAttributes(JMapper.MAP.convertValue(obj.get("includeAttributes"), new TypeReference<List<String>>() {
            }));
        }

        return includeAttributesOp;
    }

    public static OperationIncludeAttributes toData(final CdmOperationIncludeAttributes instance, final ResolveOptions resOpt, final CopyOptions options) {
        if (instance == null) {
            return null;
        }

        OperationIncludeAttributes obj = OperationBasePersistence.toData(instance, resOpt, options);
        obj.setIncludeAttributes(instance.getIncludeAttributes());

        return obj;
    }
}
