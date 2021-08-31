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
 * Class to handle AddTypeAttribute operations
 */
public class CdmOperationAddTypeAttribute extends CdmOperationBase {
    private static final String TAG = CdmOperationAddTypeAttribute.class.getSimpleName();
    private CdmTypeAttributeDefinition typeAttribute;

    public CdmOperationAddTypeAttribute(final CdmCorpusContext ctx) {
        super(ctx);
        this.setObjectType(CdmObjectType.OperationAddTypeAttributeDef);
        this.setType(CdmOperationType.AddTypeAttribute);
    }

    @Override
    public CdmObject copy(ResolveOptions resOpt, CdmObject host) {
        if (resOpt == null) {
            resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
        }

        CdmOperationAddTypeAttribute copy = host == null ? new CdmOperationAddTypeAttribute(this.getCtx()) : (CdmOperationAddTypeAttribute)host;

        copy.setTypeAttribute(
                this.getTypeAttribute() != null
                        ? (CdmTypeAttributeDefinition)this.getTypeAttribute().copy(resOpt) : null);

        this.copyProj(resOpt, copy);
        return copy;
    }

    public CdmTypeAttributeDefinition getTypeAttribute() {
        return typeAttribute;
    }

    public void setTypeAttribute(final CdmTypeAttributeDefinition typeAttribute) {
        this.typeAttribute = typeAttribute;
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Override
    @Deprecated
    public Object copyData(final ResolveOptions resOpt, final CopyOptions options) {
        return CdmObjectBase.copyData(this, resOpt, options, CdmOperationAddTypeAttribute.class);
    }

    @Override
    public String getName() {
        return "operationAddTypeAttribute";
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Override
    @Deprecated
    public CdmObjectType getObjectType() {
        return CdmObjectType.OperationAddTypeAttributeDef;
    }

    @Override
    public boolean validate() {
        ArrayList<String> missingFields = new ArrayList<>();

        if (this.typeAttribute == null) {
            missingFields.add("typeAttribute");
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
            if (StringUtils.isNullOrTrimEmpty(path)) {
                path = pathFrom + "operationAddTypeAttribute";
                this.setDeclaredPath(path);
            }
        }

        if (preChildren != null && preChildren.invoke(this, path)){
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
        AttributeContextParameters attrCtxOpAddTypeParam = new AttributeContextParameters();
        attrCtxOpAddTypeParam.setUnder(attrCtx);
        attrCtxOpAddTypeParam.setType(CdmAttributeContextType.OperationAddTypeAttribute);
        attrCtxOpAddTypeParam.setName("operation/index" + this.getIndex() + "/operationAddTypeAttribute");
        CdmAttributeContext attrCtxOpAddType = CdmAttributeContext.createChildUnder(projCtx.getProjectionDirective().getResOpt(), attrCtxOpAddTypeParam);

        // Create a new attribute context for the Type attribute we will create
        AttributeContextParameters attrCtxTypeAttrParam = new AttributeContextParameters();
        attrCtxTypeAttrParam.setUnder(attrCtxOpAddType);
        attrCtxTypeAttrParam.setType(CdmAttributeContextType.AddedAttributeSelectedType);
        attrCtxTypeAttrParam.setName("_selectedEntityName");
        CdmAttributeContext attrCtxTypeAttr = CdmAttributeContext.createChildUnder(projCtx.getProjectionDirective().getResOpt(), attrCtxTypeAttrParam);

        // Create the Type attribute with the specified "typeAttribute" (from the operation) as its target and apply the trait "is.linkedEntity.name" to it
        List<String> addTrait = new ArrayList<String>(Arrays.asList("is.linkedEntity.name"));
        ResolvedAttribute newResAttr = createNewResolvedAttribute(projCtx, attrCtxTypeAttr, this.typeAttribute, null, addTrait);

        // Create a new projection attribute state for the new Type attribute and add it to the output set
        // There is no previous state for the newly created Type attribute
        ProjectionAttributeState newPAS = new ProjectionAttributeState(projOutputSet.getCtx());
        newPAS.setCurrentResolvedAttribute(newResAttr);

        projOutputSet.add(newPAS);

        return projOutputSet;
    }
}
