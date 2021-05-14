// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.projections;

import java.util.List;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmOperationCombineAttributes;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.Utils;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections.OperationCombineAttributes;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

/**
 * Operation CombineAttributes persistence
 */
public class OperationCombineAttributesPersistence {
    public static CdmOperationCombineAttributes fromData(final CdmCorpusContext ctx, final JsonNode obj) {
        if (obj == null) {
            return null;
        }

        CdmOperationCombineAttributes combineAttributesOp = OperationBasePersistence.fromData(ctx, CdmObjectType.OperationCombineAttributesDef, obj);
        combineAttributesOp.setSelect(obj.get("select") == null ? null : JMapper.MAP.convertValue(obj.get("select"), new TypeReference<List<String>>() {
        }));
        combineAttributesOp.setMergeInto((CdmTypeAttributeDefinition) Utils.createAttribute(ctx, obj.get("mergeInto")));

        return combineAttributesOp;
    }

    public static OperationCombineAttributes toData(CdmOperationCombineAttributes instance, ResolveOptions resOpt, CopyOptions options) {
        if (instance == null) {
            return null;
        }

        OperationCombineAttributes obj = OperationBasePersistence.toData(instance, resOpt, options);
        obj.setSelect(instance.getSelect());
        obj.setMergeInto(Utils.jsonForm(instance.getMergeInto(), resOpt, options));

        return obj;
    }
}
