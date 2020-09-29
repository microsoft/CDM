// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.CdmProjection;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.projections.ProjectionPersistence;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

import java.util.List;

public class EntityReferencePersistence {

    public static CdmEntityReference fromData(final CdmCorpusContext ctx, final JsonNode obj) {
        if (obj == null) {
            return null;
        }

        final Object entity;
        boolean simpleReference = true;
        List<CdmTraitReference> appliedTraits = null;

        if (obj.isValueNode()) {
            entity = obj.asText();
        } else {
            entity = getEntityReference(ctx, obj);
            simpleReference = false;
        }

        final CdmEntityReference entityReference = ctx.getCorpus().makeRef(CdmObjectType.EntityRef, entity, simpleReference);

        if (!(obj.isValueNode())) {
            appliedTraits = Utils.createTraitReferenceList(ctx, obj.get("appliedTraits"));
            if (appliedTraits != null) {
                Utils.addListToCdmCollection(entityReference.getAppliedTraits(), appliedTraits);
            }
        }

        Utils.addListToCdmCollection(entityReference.getAppliedTraits(), appliedTraits);
        return entityReference;
    }

    public static Object toData(final CdmEntityReference instance, final ResolveOptions resOpt, final CopyOptions options) {
        if (instance.getExplicitReference() != null && instance.getExplicitReference() instanceof CdmProjection) {
            return ProjectionPersistence.toData((CdmProjection) instance.getExplicitReference(), resOpt, options);
        } else {
            return CdmObjectRefPersistence.toData(instance, resOpt, options);
        }
    }

    private static Object getEntityReference(final CdmCorpusContext ctx, final JsonNode obj) {
        Object entity = null;
        if (obj.get("entityReference") != null && obj.get("entityReference").isValueNode()) {
            entity = obj.get("entityReference");
        } else if (obj.get("entityReference") != null && obj.get("entityReference").get("entityShape") != null) {
            entity = ConstantEntityPersistence.fromData(ctx, obj.get("entityReference"));
        } else if (obj.get("source") != null) {
            entity = ProjectionPersistence.fromData(ctx, obj);
        } else {
            entity = EntityPersistence.fromData(ctx, obj.get("entityReference"));
        }

        return entity;
    }
}
