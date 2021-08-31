// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projections;

import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.enums.CdmAttributeContextType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmOperationType;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttribute;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections.ProjectionAttributeState;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections.ProjectionAttributeStateSet;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections.ProjectionContext;
import com.microsoft.commondatamodel.objectmodel.utilities.*;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.util.ArrayList;
import java.util.stream.Collectors;

/**
 * Class to handle AddArtifactAttribute operations
 */
public class CdmOperationAddArtifactAttribute extends CdmOperationBase {
    private static final String TAG = CdmOperationAddArtifactAttribute.class.getSimpleName();
    private CdmAttributeItem newAttribute;
    private Boolean insertAtTop;

    public CdmOperationAddArtifactAttribute(final CdmCorpusContext ctx) {
        super(ctx);
        this.setObjectType(CdmObjectType.OperationAddArtifactAttributeDef);
        this.setType(CdmOperationType.AddArtifactAttribute);
    }

    public CdmAttributeItem getNewAttribute() {
        return newAttribute;
    }

    public void setNewAttribute(final CdmAttributeItem newAttribute) {
        this.newAttribute = newAttribute;
    }

    public Boolean getInsertAtTop() {
        return insertAtTop;
    }

    public void setInsertAtTop(final Boolean insertAtTop) {
        this.insertAtTop = insertAtTop;
    }

    @Override
    public CdmObject copy(ResolveOptions resOpt, CdmObject host) {
        if (resOpt == null) {
            resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
        }

        CdmOperationAddArtifactAttribute copy = host == null ? new CdmOperationAddArtifactAttribute(this.getCtx()) :  (CdmOperationAddArtifactAttribute)host;

        copy.setNewAttribute(
                this.getNewAttribute() != null
                        ? (CdmAttributeItem)this.getNewAttribute().copy(resOpt): null);
        copy.setInsertAtTop(this.getInsertAtTop());

        this.copyProj(resOpt, copy);
        return copy;
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Override
    @Deprecated
    public Object copyData(final ResolveOptions resOpt, final CopyOptions options) {
        return CdmObjectBase.copyData(this, resOpt, options, CdmOperationAddArtifactAttribute.class);
    }

    @Override
    public String getName() {
        return "operationAddArtifactAttribute";
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Override
    @Deprecated
    public CdmObjectType getObjectType() {
        return CdmObjectType.OperationAddArtifactAttributeDef;
    }

    @Override
    public boolean validate() {
        ArrayList<String> missingFields = new ArrayList<>();

        if (this.newAttribute == null) {
            missingFields.add("newAttribute");
        }

        if (missingFields.size() > 0) {
            Logger.error(this.getCtx(), TAG, "validate", this.getAtCorpusPath(), CdmLogCode.ErrValdnIntegrityCheckFailure, this.getAtCorpusPath(), String.join(", ", missingFields.parallelStream().map((s) -> { return String.format("'%s'", s);}).collect(Collectors.toList())));
            return false;
        }
        return true;
    }

    @Override
    public boolean visit(final String pathFrom, final VisitCallback preChildren, final VisitCallback postChildren) {
        String path = "";
        if (!this.getCtx().getCorpus().getBlockDeclaredPathChanges()) {
            path = this.getDeclaredPath();
            if (StringUtils.isNullOrEmpty(path)) {
                path = pathFrom + this.getName();
                this.setDeclaredPath(path);
            }
        }

        if (preChildren != null && preChildren.invoke(this, path)) {
            return false;
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

        if (this.insertAtTop == null || !this.insertAtTop) {
            addAllPreviousAttributeStates(projCtx, projOutputSet);
            addNewArtifactAttributeState(projCtx, projOutputSet, attrCtx);
        } else {
            addNewArtifactAttributeState(projCtx, projOutputSet, attrCtx);
            addAllPreviousAttributeStates(projCtx, projOutputSet);
        }

        return projOutputSet;
    }

    private void addNewArtifactAttributeState(final ProjectionContext projCtx, final ProjectionAttributeStateSet projOutputSet, final CdmAttributeContext attrCtx) {
        // Create a new attribute context for the operation
        AttributeContextParameters attrCtxOpAddArtifactAttrParam = new AttributeContextParameters();
        attrCtxOpAddArtifactAttrParam.setUnder(attrCtx);
        attrCtxOpAddArtifactAttrParam.setType(CdmAttributeContextType.OperationAddArtifactAttribute);
        attrCtxOpAddArtifactAttrParam.setName("operation/index" + this.getIndex() + "/" + this.getName());
        CdmAttributeContext attrCtxOpAddArtifactAttr = CdmAttributeContext.createChildUnder(projCtx.getProjectionDirective().getResOpt(), attrCtxOpAddArtifactAttrParam);

        if (this.newAttribute instanceof CdmTypeAttributeDefinition) {
            // Create a new attribute context for the new artifact attribute we will create
            AttributeContextParameters attrCtxNewAttrParam = new AttributeContextParameters();
            attrCtxNewAttrParam.setUnder(attrCtxOpAddArtifactAttr);
            attrCtxNewAttrParam.setType(CdmAttributeContextType.AddedAttributeNewArtifact);
            attrCtxNewAttrParam.setName(this.newAttribute.fetchObjectDefinitionName());
            CdmAttributeContext attrCtxNewAttr = CdmAttributeContext.createChildUnder(projCtx.getProjectionDirective().getResOpt(), attrCtxNewAttrParam);
            ResolvedAttribute newResAttr = createNewResolvedAttribute(projCtx, attrCtxNewAttr, (CdmAttribute)this.newAttribute);

            // Create a new projection attribute state for the new artifact attribute and add it to the output set
            // There is no previous state for the newly created attribute
            ProjectionAttributeState newPAS = new ProjectionAttributeState(projOutputSet.getCtx());
            newPAS.setCurrentResolvedAttribute(newResAttr);

            projOutputSet.add(newPAS);
        } else if (this.newAttribute instanceof CdmEntityAttributeDefinition || this.newAttribute instanceof CdmAttributeGroupReference) {
            String typeStr = this.newAttribute instanceof CdmEntityAttributeDefinition ? "an entity attribute" : "an attribute group";
            Logger.warning(this.getCtx(), TAG, "appendProjectionAttributeState", this.getAtCorpusPath(), CdmLogCode.WarnProjAddArtifactAttrNotSupported, typeStr);
        } else {
            Logger.error(this.getCtx(), TAG, "appendProjectionAttributeState", this.getAtCorpusPath(), CdmLogCode.ErrProjUnsupportedSource, this.newAttribute.getObjectType().toString(), this.getName());
        }
    }

    private void addAllPreviousAttributeStates(final ProjectionContext projCtx, final ProjectionAttributeStateSet projOutputSet) {
        // Pass through all the input projection attribute states if there are any
        for (ProjectionAttributeState currentPAS : projCtx.getCurrentAttributeStateSet().getStates()) {
            projOutputSet.add(currentPAS);
        }
    }
}
