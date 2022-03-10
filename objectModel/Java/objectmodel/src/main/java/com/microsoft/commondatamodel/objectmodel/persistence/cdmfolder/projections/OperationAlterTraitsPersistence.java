// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.projections;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCollection;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReferenceBase;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmOperationAlterTraits;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.Utils;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections.OperationAlterTraits;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;

/**
 * Operation AlterTrait persistence
 */
public class OperationAlterTraitsPersistence {
    private static final String TAG = OperationAlterTraitsPersistence.class.getSimpleName();

    public static CdmOperationAlterTraits fromData(final CdmCorpusContext ctx, final JsonNode obj) {
        if (obj == null) {
            return null;
        }

        CdmOperationAlterTraits alterTraitsOp = OperationBasePersistence.fromData(ctx, CdmObjectType.OperationAlterTraitsDef, obj);

        final ArrayList<CdmTraitReferenceBase> traitsToAdd = Utils.createTraitReferenceList(ctx, obj.get("traitsToAdd"));
        if (traitsToAdd != null) {
            alterTraitsOp.setTraitsToAdd(new CdmCollection<CdmTraitReferenceBase>(ctx, alterTraitsOp, CdmObjectType.TraitRef));
            Utils.addListToCdmCollection(alterTraitsOp.getTraitsToAdd(), traitsToAdd);
        }

        final ArrayList<CdmTraitReferenceBase> traitsToRemove = Utils.createTraitReferenceList(ctx, obj.get("traitsToRemove"));
        if (traitsToRemove != null) {
            alterTraitsOp.setTraitsToRemove(new CdmCollection<CdmTraitReferenceBase>(ctx, alterTraitsOp, CdmObjectType.TraitRef));
            Utils.addListToCdmCollection(alterTraitsOp.getTraitsToRemove(), traitsToRemove);
        }

        if (obj.get("argumentsContainWildcards") != null) {
            alterTraitsOp.setArgumentsContainWildcards(obj.get("argumentsContainWildcards").asBoolean());
        }

        if (obj.get("applyTo") != null) {
            if (obj.get("applyTo").isValueNode()) {
                alterTraitsOp.setApplyTo(
                        new ArrayList<>(Collections.singletonList(obj.get("applyTo").asText())));
            } else if (obj.get("applyTo").isArray()) {
                alterTraitsOp.setApplyTo(JMapper.MAP.convertValue(obj.get("applyTo"), new TypeReference<ArrayList<String>>() {
                }));
            } else {
                Logger.error(ctx, TAG, "fromData", alterTraitsOp.getAtCorpusPath(), CdmLogCode. ErrPersistProjUnsupportedProp, "applyTo", "string or list of strings");
            }
        }

        return alterTraitsOp;
    }

    public static OperationAlterTraits toData(final CdmOperationAlterTraits instance, final ResolveOptions resOpt, final CopyOptions options) {
        if (instance == null) {
            return null;
        }

        OperationAlterTraits obj = OperationBasePersistence.toData(instance, resOpt, options);
        obj.setTraitsToAdd(Utils.listCopyDataAsArrayNode(instance.getTraitsToAdd(), resOpt, options));
        obj.setTraitsToRemove(Utils.listCopyDataAsArrayNode(instance.getTraitsToRemove(), resOpt, options));
        obj.setArgumentsContainWildcards(instance.getArgumentsContainWildcards());
        obj.setApplyTo(instance.getApplyTo());

        return obj;
    }
}
