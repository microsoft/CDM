// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projections;

import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.enums.CdmAttributeContextType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmOperationType;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.*;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections.ProjectionAttributeState;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections.ProjectionAttributeStateSet;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections.ProjectionContext;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections.ProjectionResolutionCommonUtil;
import com.microsoft.commondatamodel.objectmodel.utilities.*;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Class to handle ReplaceAsForeignKey operations
 */
public class CdmOperationReplaceAsForeignKey extends CdmOperationBase {
    private static String TAG = CdmOperationReplaceAsForeignKey.class.getSimpleName();
    private String reference;
    private CdmTypeAttributeDefinition replaceWith;

    public CdmOperationReplaceAsForeignKey(final CdmCorpusContext ctx) {
        super(ctx);
        this.setObjectType(CdmObjectType.OperationReplaceAsForeignKeyDef);
        this.setType(CdmOperationType.ReplaceAsForeignKey);
    }

    @Override
    public CdmObject copy(ResolveOptions resOpt, CdmObject host) {
        final CdmOperationReplaceAsForeignKey copy = new CdmOperationReplaceAsForeignKey(this.getCtx());
        copy.setReference(this.getReference());
        copy.setReplaceWith((CdmTypeAttributeDefinition) this.getReplaceWith().copy());

        return copy;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(final String reference) {
        this.reference = reference;
    }

    public CdmTypeAttributeDefinition getReplaceWith() {
        return replaceWith;
    }

    public void setReplaceWith(final CdmTypeAttributeDefinition replaceWith) {
        this.replaceWith = replaceWith;
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Override
    @Deprecated
    public Object copyData(final ResolveOptions resOpt, final CopyOptions options) {
        return CdmObjectBase.copyData(this, resOpt, options, CdmOperationReplaceAsForeignKey.class);
    }

    @Override
    public String getName() {
        return "operationReplaceAsForeignKey";
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Override
    @Deprecated
    public CdmObjectType getObjectType() {
        return CdmObjectType.OperationReplaceAsForeignKeyDef;
    }

    @Override
    public boolean validate() {
        ArrayList<String> missingFields = new ArrayList<>();

        if (StringUtils.isNullOrTrimEmpty(this.reference)) {
            missingFields.add("reference");
        }
        if (this.replaceWith == null) {
            missingFields.add("replaceWith");
        }
        if (missingFields.size() > 0) {
            Logger.error(TAG, this.getCtx(), Errors.validateErrorString(this.getAtCorpusPath(), missingFields));
            return false;
        }
        return true;
    }

    @Override
    public boolean visit(final String pathFrom, final VisitCallback preChildren, final VisitCallback postChildren) {
        String path = "";
        if (!this.getCtx().getCorpus().getBlockDeclaredPathChanges()) {
            path = this.getDeclaredPath();
            if (StringUtils.isNullOrTrimEmpty(path))
            {
                path = pathFrom + "operationReplaceAsForeignKey";
                this.setDeclaredPath(path);
            }
        }

        if (preChildren != null && preChildren.invoke(this, path)) {
            return false;
        }

        if (this.replaceWith != null) {
            if (this.replaceWith.visit(pathFrom + "foreignKeyAttribute/", preChildren, postChildren)) {
                return true;
            }
        }

        if (postChildren != null && postChildren.invoke(this, path)) {
            return true;
        }

        return false;
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Override
    @Deprecated
    public ProjectionAttributeStateSet appendProjectionAttributeState(ProjectionContext projCtx, ProjectionAttributeStateSet projOutputSet, CdmAttributeContext attrCtx) {
        // Create new attribute context for the operation
        AttributeContextParameters attrCtxOpFKParam = new AttributeContextParameters();
        attrCtxOpFKParam.setUnder(attrCtx);
        attrCtxOpFKParam.setType(CdmAttributeContextType.OperationReplaceAsForeignKey);
        attrCtxOpFKParam.setName("operation/index" + this.getIndex() + "/operationReplaceAsForeignKey");
        CdmAttributeContext attrCtxOpFK = CdmAttributeContext.createChildUnder(projCtx.getProjectionDirective().getResOpt(), attrCtxOpFKParam);

        // Create new attribute context for the AddedAttributeIdentity
        AttributeContextParameters attrCtxFKParam = new AttributeContextParameters();
        attrCtxFKParam.setUnder(attrCtxOpFK);
        attrCtxFKParam.setType(CdmAttributeContextType.AddedAttributeIdentity);
        attrCtxFKParam.setName("_foreignKey");
        CdmAttributeContext attrCtxFK = CdmAttributeContext.createChildUnder(projCtx.getProjectionDirective().getResOpt(), attrCtxFKParam);

        // get the added attribute and applied trait
        // the name here will be {m} and not {A}{o}{M} - should this map to the not projections approach and default to {A}{o}{M} - ???
        CdmTypeAttributeDefinition subFK = this.replaceWith;
        List<String> addTrait = new ArrayList<>(Arrays.asList("is.linkedEntity.identifier"));

        // Create new resolved attribute, set the new attribute as target, and apply "is.linkedEntity.identifier" trait
        ResolvedAttribute resAttrNewFK = createNewResolvedAttribute(projCtx, attrCtxFK, subFK, null, addTrait);

        ProjectionAttributeStateSet outputFromOpPasSet = createNewProjectionAttributeStateSet(projCtx, projOutputSet, resAttrNewFK, this.reference);

        return outputFromOpPasSet;
    }

    private static ProjectionAttributeStateSet createNewProjectionAttributeStateSet(
        ProjectionContext projCtx,
        ProjectionAttributeStateSet projOutputSet,
        ResolvedAttribute newResAttrFK,
        String refAttrName) {
        List<ProjectionAttributeState> pasList = ProjectionResolutionCommonUtil.getLeafList(projCtx, refAttrName);

        if (pasList != null) {
            // update the new foreign key resolved attribute with trait param with reference details
            ResolvedTrait reqdTrait = newResAttrFK.getResolvedTraits().find(projCtx.getProjectionDirective().getResOpt(), "is.linkedEntity.identifier");
            if (reqdTrait != null) {
                CdmEntityReference traitParamEntRef = ProjectionResolutionCommonUtil.createForeignKeyLinkedEntityIdentifierTraitParameter(projCtx.getProjectionDirective(), projOutputSet.getCtx().getCorpus(), pasList);
                reqdTrait.getParameterValues().setParameterValue(projCtx.getProjectionDirective().getResOpt(), "entityReferences", traitParamEntRef);
            }

            // Create new output projection attribute state set for FK and add prevPas as previous state set
            ProjectionAttributeState newProjAttrStateFK = new ProjectionAttributeState(projOutputSet.getCtx());
            newProjAttrStateFK.setCurrentResolvedAttribute(newResAttrFK);
            newProjAttrStateFK.setPreviousStateList(pasList);

            projOutputSet.add(newProjAttrStateFK);
        } else {
            // Log error & return projOutputSet without any change
            Logger.error(TAG, projOutputSet.getCtx(), Logger.format("Unable to locate state for reference attribute \"{0}\".", refAttrName), "createNewProjectionAttributeStateSet");
        }

        return projOutputSet;
    }
}
