// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projections;

import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.enums.CdmAttributeContextType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmOperationType;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttribute;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttributeSetBuilder;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections.ProjectionAttributeState;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections.ProjectionAttributeStateSet;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections.ProjectionContext;
import com.microsoft.commondatamodel.objectmodel.utilities.*;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.util.ArrayList;
import java.util.stream.Collectors;

/**
 * Class to handle AddAttributeGroup operations
 */
public class CdmOperationAddAttributeGroup extends CdmOperationBase {
    private static final String TAG = CdmOperationAddAttributeGroup.class.getSimpleName();
    private String attributeGroupName;


    public CdmOperationAddAttributeGroup(final CdmCorpusContext ctx) {
        super(ctx);
        this.setObjectType(CdmObjectType.OperationAddAttributeGroupDef);
        this.setType(CdmOperationType.AddAttributeGroup);
    }

    @Override
    public CdmObject copy(ResolveOptions resOpt, CdmObject host) {
        if (resOpt == null) {
            resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
        }

        CdmOperationAddAttributeGroup copy = host == null ?  new CdmOperationAddAttributeGroup(this.getCtx()) : (CdmOperationAddAttributeGroup)host;

        copy.setAttributeGroupName(this.getAttributeGroupName());

        this.copyProj(resOpt, copy);
        return copy;
    }

    /**
     * Name given to the attribute group that will be created
     * @return String
     */
    public String getAttributeGroupName() {
        return attributeGroupName;
    }

    /**
     * Name given to the attribute group that will be created
     * @param attributeGroupName String
     */
    public void setAttributeGroupName(String attributeGroupName) {
        this.attributeGroupName = attributeGroupName;
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Override
    @Deprecated
    public Object copyData(final ResolveOptions resOpt, final CopyOptions options) {
        return CdmObjectBase.copyData(this, resOpt, options, CdmOperationAddAttributeGroup.class);
    }

    @Override
    public String getName() {
        return "operationAddAttributeGroup";
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Override
    @Deprecated
    public CdmObjectType getObjectType() {
        return CdmObjectType.OperationAddAttributeGroupDef;
    }

    @Override
    public boolean validate() {
        ArrayList<String> missingFields = new ArrayList<>();

        if (StringUtils.isNullOrTrimEmpty(this.attributeGroupName)) {
            missingFields.add("attributeGroupName");
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
        // Create a new attribute context for the operation
        AttributeContextParameters attrCtxOpAddAttrGroupParam = new AttributeContextParameters();
        attrCtxOpAddAttrGroupParam.setUnder(attrCtx);
        attrCtxOpAddAttrGroupParam.setType(CdmAttributeContextType.OperationAddAttributeGroup);
        attrCtxOpAddAttrGroupParam.setName("operation/index" + this.getIndex() + "/" + this.getName());
        CdmAttributeContext attrCtxOpAddAttrGroup = CdmAttributeContext.createChildUnder(projCtx.getProjectionDirective().getResOpt(), attrCtxOpAddAttrGroupParam);

        // Create a new attribute context for the attribute group we will create
        AttributeContextParameters attrCtxAttrGroupParam = new AttributeContextParameters();
        attrCtxAttrGroupParam.setUnder(attrCtxOpAddAttrGroup);
        attrCtxAttrGroupParam.setType(CdmAttributeContextType.AttributeDefinition);
        attrCtxAttrGroupParam.setName(this.attributeGroupName);
        CdmAttributeContext attrCtxAttrGroup = CdmAttributeContext.createChildUnder(projCtx.getProjectionDirective().getResOpt(), attrCtxAttrGroupParam);

        // Create a new resolve attribute set builder that will be used to combine all the attributes into one set
        ResolvedAttributeSetBuilder rasb = new ResolvedAttributeSetBuilder();

        // Iterate through all the projection attribute states generated from the source's resolved attributes
        // Each projection attribute state contains a resolved attribute that it is corresponding to
        for (ProjectionAttributeState currentPAS : projCtx.getCurrentAttributeStateSet().getStates()) {
            // Create a copy of the resolved attribute
            ResolvedAttribute resolvedAttribute = currentPAS.getCurrentResolvedAttribute().copy();

            // Add the attribute to the resolved attribute set
            rasb.getResolvedAttributeSet().merge(resolvedAttribute);

            // Add each attribute's attribute context to the resolved attribute set attribute context
            AttributeContextParameters attrParam = new AttributeContextParameters();
            attrParam.setUnder(attrCtxAttrGroup);
            attrParam.setType(CdmAttributeContextType.AttributeDefinition);
            attrParam.setName(resolvedAttribute.getResolvedName());
            resolvedAttribute.setAttCtx(CdmAttributeContext.createChildUnder(projCtx.getProjectionDirective().getResOpt(), attrParam));
            resolvedAttribute.getAttCtx().addLineage(currentPAS.getCurrentResolvedAttribute().getAttCtx());
        }

        // Create a new resolved attribute that will hold the attribute set containing all the attributes
        ResolvedAttribute resAttrNew = new ResolvedAttribute(projCtx.getProjectionDirective().getResOpt(),
                rasb.getResolvedAttributeSet(), this.attributeGroupName, attrCtxAttrGroup);

        // Create a new projection attribute state pointing to the resolved attribute set that represents the attribute group
        ProjectionAttributeState newPAS = new ProjectionAttributeState(this.getCtx());
        newPAS.setCurrentResolvedAttribute(resAttrNew);
        projOutputSet.add(newPAS);

        return projOutputSet;
    }
}
