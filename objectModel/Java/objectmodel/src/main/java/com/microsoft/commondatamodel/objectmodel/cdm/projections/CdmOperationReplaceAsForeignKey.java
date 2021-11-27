// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projections;

import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.enums.CdmAttributeContextType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
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
import java.util.stream.Collectors;

/**
 * Class to handle ReplaceAsForeignKey operations
 */
public class CdmOperationReplaceAsForeignKey extends CdmOperationBase {
    private static final String TAG = CdmOperationReplaceAsForeignKey.class.getSimpleName();
    private String reference;
    private CdmTypeAttributeDefinition replaceWith;

    public CdmOperationReplaceAsForeignKey(final CdmCorpusContext ctx) {
        super(ctx);
        this.setObjectType(CdmObjectType.OperationReplaceAsForeignKeyDef);
        this.setType(CdmOperationType.ReplaceAsForeignKey);
    }

    @Override
    public CdmObject copy(ResolveOptions resOpt, CdmObject host) {
        if (resOpt == null) {
            resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
        }

        CdmOperationReplaceAsForeignKey copy = host == null ? new CdmOperationReplaceAsForeignKey(this.getCtx()) : (CdmOperationReplaceAsForeignKey)host;

        copy.setReplaceWith(
                this.getReplaceWith() != null
                        ? (CdmTypeAttributeDefinition)this.getReplaceWith().copy(resOpt) : null);
        copy.reference = this.reference;

        this.copyProj(resOpt, copy);
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
            Logger.error(this.getCtx(), TAG, "validate", this.getAtCorpusPath(), CdmLogCode.ErrValdnIntegrityCheckFailure, this.getAtCorpusPath(), String.join(", ", missingFields.parallelStream().map((s) -> { return String.format("'%s'", s);}).collect(Collectors.toList())));
            return false;
        }
        return true;
    }

    @Override
    public boolean visit(final String pathFrom, final VisitCallback preChildren, final VisitCallback postChildren) {
        String path = this.fetchDeclaredPath(pathFrom);

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
        String sourceEntity = projCtx.getProjectionDirective().getOriginalSourceAttributeName();

        if (sourceEntity == null) {
            Logger.warning(projOutputSet.getCtx(), TAG, "createNewProjectionAttributeStateSet", null,
                    CdmLogCode.WarnProjFKWithoutSourceEntity, refAttrName);
        }

        if (pasList != null) {
            // update the new foreign key resolved attribute with trait param with reference details
            ResolvedTrait reqdTrait = newResAttrFK.getResolvedTraits().find(projCtx.getProjectionDirective().getResOpt(), "is.linkedEntity.identifier");
            if (reqdTrait != null && sourceEntity != null) {
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
            Logger.error(projOutputSet.getCtx(), TAG, "createNewProjectionAttributeStateSet", null, CdmLogCode.ErrProjRefAttrStateFailure, refAttrName);
        }

        return projOutputSet;
    }
}
