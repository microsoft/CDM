// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.projections;

import java.util.ArrayList;
import java.util.Arrays;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmOperationRenameAttributes;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections.OperationRenameAttributes;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

/**
 * Operation RenameAttributes persistence
 */
public class OperationRenameAttributesPersistence {
    private static String tag = OperationRenameAttributesPersistence.class.getSimpleName();

    public static CdmOperationRenameAttributes fromData(final CdmCorpusContext ctx, final JsonNode obj) {
        if (obj == null) {
            return null;
        }

        CdmOperationRenameAttributes renameAttributesOp = OperationBasePersistence.fromData(ctx, CdmObjectType.OperationRenameAttributesDef, obj);

        if (obj.get("renameFormat") != null) {
            renameAttributesOp.setRenameFormat(obj.get("renameFormat").asText());
        }

        if (obj.get("applyTo") != null) {
            if (obj.get("applyTo").isValueNode()) {
                renameAttributesOp.setApplyTo(
                        new ArrayList<>(Arrays.asList(obj.get("applyTo").asText())));
            } else if (obj.get("applyTo").isArray()) {
                renameAttributesOp.setApplyTo(JMapper.MAP.convertValue(obj.get("applyTo"), new TypeReference<ArrayList<String>>() {
                }));
            } else {
                Logger.error(ctx, tag, "fromData", renameAttributesOp.getAtCorpusPath(), CdmLogCode.ErrPersistProjUnsupportedProp);
            }
        }

        return renameAttributesOp;
    }

    public static OperationRenameAttributes toData(final CdmOperationRenameAttributes instance, final ResolveOptions resOpt, final CopyOptions options) {
        if (instance == null) {
            return null;
        }

        OperationRenameAttributes obj = OperationBasePersistence.toData(instance, resOpt, options);
        obj.setRenameFormat(instance.getRenameFormat());
        obj.setApplyTo(instance.getApplyTo());

        return obj;
    }
}
