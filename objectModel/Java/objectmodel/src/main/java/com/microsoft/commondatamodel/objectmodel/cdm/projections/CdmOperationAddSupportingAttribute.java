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
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Class to handle AddSupportingAttribute operations
 */
public class CdmOperationAddSupportingAttribute extends CdmOperationBase {
    private static final String TAG = CdmOperationAddSupportingAttribute.class.getSimpleName();
    private CdmTypeAttributeDefinition supportingAttribute;

    public CdmOperationAddSupportingAttribute(final CdmCorpusContext ctx) {
        super(ctx);
        this.setObjectType(CdmObjectType.OperationAddSupportingAttributeDef);
        this.setType(CdmOperationType.AddSupportingAttribute);
    }

    @Override
    public CdmObject copy(ResolveOptions resOpt, CdmObject host) {
        if (resOpt == null) {
            resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
        }

        CdmOperationAddSupportingAttribute copy = host == null ? new CdmOperationAddSupportingAttribute(this.getCtx()) : (CdmOperationAddSupportingAttribute)host;

        copy.setSupportingAttribute(
                this.getSupportingAttribute() != null
                        ? (CdmTypeAttributeDefinition)this.getSupportingAttribute().copy(resOpt) : null);

        this.copyProj(resOpt, copy);
        return copy;
    }

    public CdmTypeAttributeDefinition getSupportingAttribute() {
        return supportingAttribute;
    }

    public void setSupportingAttribute(final CdmTypeAttributeDefinition supportingAttribute) {
        this.supportingAttribute = supportingAttribute;
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Override
    @Deprecated
    public Object copyData(final ResolveOptions resOpt, final CopyOptions options) {
        return CdmObjectBase.copyData(this, resOpt, options, CdmOperationAddSupportingAttribute.class);
    }

    @Override
    public String getName() {
        return "operationAddSupportingAttribute";
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Override
    @Deprecated
    public CdmObjectType getObjectType() {
        return CdmObjectType.OperationAddSupportingAttributeDef;
    }

    @Override
    public boolean validate() {
        ArrayList<String> missingFields = new ArrayList<>();

        if (this.supportingAttribute == null) {
            missingFields.add("supportingAttribute");
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
        // Pass through all the input projection attribute states if there are any
        for (ProjectionAttributeState currentPAS : projCtx.getCurrentAttributeStateSet().getStates()) {
            projOutputSet.add(currentPAS);
        }

        // Create a new attribute context for the operation
        AttributeContextParameters attrCtxOpAddSupportingAttrParam = new AttributeContextParameters();
        attrCtxOpAddSupportingAttrParam.setUnder(attrCtx);
        attrCtxOpAddSupportingAttrParam.setType(CdmAttributeContextType.OperationAddSupportingAttribute);
        attrCtxOpAddSupportingAttrParam.setName("operation/index" + this.getIndex() + "/" + this.getName());
        CdmAttributeContext attrCtxOpAddSupportingAttr = CdmAttributeContext.createChildUnder(projCtx.getProjectionDirective().getResOpt(), attrCtxOpAddSupportingAttrParam);

        // Create a new attribute context for the supporting attribute we will create
        AttributeContextParameters attrCtxSupportingAttrParam = new AttributeContextParameters();
        attrCtxSupportingAttrParam.setUnder(attrCtxOpAddSupportingAttr);
        attrCtxSupportingAttrParam.setType(CdmAttributeContextType.AddedAttributeSupporting);
        attrCtxSupportingAttrParam.setName(this.supportingAttribute.getName());
        CdmAttributeContext attrCtxSupportingAttr = CdmAttributeContext.createChildUnder(projCtx.getProjectionDirective().getResOpt(), attrCtxSupportingAttrParam);
        
        // TODO: this if statement keeps the functionality the same way it works currently in resolution guidance.
        // This should be changed to point to the foreign key attribute instead. 
        // There has to be some design decisions about how this will work and will be done in the next release.
        if (projCtx.getCurrentAttributeStateSet().getStates().size() > 0) {
            int lastIndex = projCtx.getCurrentAttributeStateSet().getStates().size() - 1;
            ProjectionAttributeState lastState = projCtx.getCurrentAttributeStateSet().getStates().get(lastIndex);
            CdmTraitReference inSupportOfTrait = (CdmTraitReference) this.supportingAttribute.getAppliedTraits().add("is.addedInSupportOf");
            inSupportOfTrait.getArguments().add("inSupportOf", lastState.getCurrentResolvedAttribute().getResolvedName());
        }

        // Create the supporting attribute with the specified "supportingAttribute" property as its target and apply the trait "is.virtual.attribute" to it
        List<String> addTrait = new ArrayList<String>(Arrays.asList("is.virtual.attribute"));
        ResolvedAttribute newResAttr = createNewResolvedAttribute(projCtx, attrCtxSupportingAttr, this.supportingAttribute, null, addTrait);

        // Create a new projection attribute state for the new supporting attribute and add it to the output set
        // There is no previous state for the newly created supporting attribute
        ProjectionAttributeState newPAS = new ProjectionAttributeState(projOutputSet.getCtx());
        newPAS.setCurrentResolvedAttribute(newResAttr);

        projOutputSet.add(newPAS);

        return projOutputSet;
    }
}
