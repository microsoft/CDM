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
 * Class to handle AddCountAttribute operations
 */
public class CdmOperationAddCountAttribute extends CdmOperationBase {
    private String tag = CdmOperationAddCountAttribute.class.getSimpleName();
    private CdmTypeAttributeDefinition countAttribute;

    public CdmOperationAddCountAttribute(final CdmCorpusContext ctx) {
        super(ctx);
        this.setObjectType(CdmObjectType.OperationAddCountAttributeDef);
        this.setType(CdmOperationType.AddCountAttribute);
    }

    @Override
    public CdmObject copy(ResolveOptions resOpt, CdmObject host) {
        CdmOperationAddCountAttribute copy = new CdmOperationAddCountAttribute(this.getCtx());
        copy.countAttribute = (CdmTypeAttributeDefinition) this.countAttribute.copy(resOpt, host);
        return copy;
    }

    public CdmTypeAttributeDefinition getCountAttribute() {
        return countAttribute;
    }

    public void setCountAttribute(final CdmTypeAttributeDefinition countAttribute) {
        this.countAttribute = countAttribute;
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Override
    @Deprecated
    public Object copyData(final ResolveOptions resOpt, final CopyOptions options) {
        return CdmObjectBase.copyData(this, resOpt, options, CdmOperationAddCountAttribute.class);
    }

    @Override
    public String getName() {
        return "operationAddCountAttribute";
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Override
    @Deprecated
    public CdmObjectType getObjectType() {
        return CdmObjectType.OperationAddCountAttributeDef;
    }

    @Override
    public boolean validate() {
        ArrayList<String> missingFields = new ArrayList<>();

        if (this.countAttribute == null) {
            missingFields.add("countAttribute");
        }
        if (missingFields.size() > 0) {
            Logger.error(this.getCtx(), tag, "validate", this.getAtCorpusPath(), CdmLogCode.ErrValdnIntegrityCheckFailure, this.getAtCorpusPath(), String.join(", ", missingFields.parallelStream().map((s) -> { return String.format("'%s'", s);}).collect(Collectors.toList())));
            return false;
        }
        return true;
    }

    @Override
    public boolean visit(final String pathFrom, final VisitCallback preChildren, final VisitCallback postChildren) {
        String path = "";
        if (!this.getCtx().getCorpus().getBlockDeclaredPathChanges()) {
            path = this.getDeclaredPath();
            if (StringUtils.isNullOrTrimEmpty(path)) {
                path = pathFrom + "operationAddCountAttribute";
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
        // Pass through all the input projection attribute states if there are any
        for (ProjectionAttributeState currentPAS : projCtx.getCurrentAttributeStateSet().getStates()) {
            projOutputSet.add(currentPAS);
        }

        // Create a new attribute context for the operation
        AttributeContextParameters attrCtxOpAddCountParam = new AttributeContextParameters();
        attrCtxOpAddCountParam.setUnder(attrCtx);
        attrCtxOpAddCountParam.setType(CdmAttributeContextType.OperationAddCountAttribute);
        attrCtxOpAddCountParam.setName("operation/index" + this.getIndex() + "/operationAddCountAttribute");
        CdmAttributeContext attrCtxOpAddCount = CdmAttributeContext.createChildUnder(projCtx.getProjectionDirective().getResOpt(), attrCtxOpAddCountParam);

        // Create a new attribute context for the Count attribute we will create
        AttributeContextParameters attrCtxCountAttrParam = new AttributeContextParameters();
        attrCtxCountAttrParam.setUnder(attrCtxOpAddCount);
        attrCtxCountAttrParam.setType(CdmAttributeContextType.AddedAttributeExpansionTotal);
        attrCtxCountAttrParam.setName(this.countAttribute.getName());
        CdmAttributeContext attrCtxCountAttr = CdmAttributeContext.createChildUnder(projCtx.getProjectionDirective().getResOpt(), attrCtxCountAttrParam);

        // Create the Count attribute with the specified CountAttribute as its target and apply the trait "is.linkedEntity.array.count" to it
        List<String> addTrait = new ArrayList<String>(Arrays.asList("is.linkedEntity.array.count"));
        ResolvedAttribute newResAttr = createNewResolvedAttribute(projCtx, attrCtxCountAttr, this.countAttribute, null, addTrait);

        // Create a new projection attribute state for the new Count attribute and add it to the output set
        // There is no previous state for the newly created Count attribute
        ProjectionAttributeState newPAS = new ProjectionAttributeState(projOutputSet.getCtx());
        newPAS.setCurrentResolvedAttribute(newResAttr);

        projOutputSet.add(newPAS);

        return projOutputSet;
    }
}
