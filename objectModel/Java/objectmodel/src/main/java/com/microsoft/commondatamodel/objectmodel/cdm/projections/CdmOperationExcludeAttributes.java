// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projections;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObject;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObjectBase;
import com.microsoft.commondatamodel.objectmodel.enums.CdmAttributeContextType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmOperationType;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections.*;
import com.microsoft.commondatamodel.objectmodel.utilities.*;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * Class to handle ExcludeAttributes operations
 */
public class CdmOperationExcludeAttributes extends CdmOperationBase {
    private String TAG = CdmOperationExcludeAttributes.class.getSimpleName();
    private List<String> excludeAttributes;

    public CdmOperationExcludeAttributes(final CdmCorpusContext ctx) {
        super(ctx);
        this.setObjectType(CdmObjectType.OperationExcludeAttributesDef);
        this.setType(CdmOperationType.ExcludeAttributes);
        this.excludeAttributes = new ArrayList<>();
    }

    @Override
    public CdmObject copy(ResolveOptions resOpt, CdmObject host) {
        CdmOperationExcludeAttributes copy = new CdmOperationExcludeAttributes(this.getCtx());
        copy.excludeAttributes = new ArrayList<String>(this.excludeAttributes);
        return copy;
    }

    public List<String> getExcludeAttributes() {
        return excludeAttributes;
    }

    public void setExcludeAttributes(final List<String> excludeAttributes) {
        this.excludeAttributes = excludeAttributes;
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Override
    @Deprecated
    public Object copyData(final ResolveOptions resOpt, final CopyOptions options) {
        return CdmObjectBase.copyData(this, resOpt, options, CdmOperationExcludeAttributes.class);
    }

    @Override
    public String getName() {
        return "operationExcludeAttributes";
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Override
    @Deprecated
    public CdmObjectType getObjectType() {
        return CdmObjectType.OperationExcludeAttributesDef;
    }

    @Override
    public boolean validate() {
        ArrayList<String> missingFields = new ArrayList<>();

        if (this.excludeAttributes == null) {
            missingFields.add("excludeAttributes");
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
            if (StringUtils.isNullOrEmpty(path)) {
                path = pathFrom + "operationExcludeAttributes";
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
        // Create a new attribute context for the operation
        AttributeContextParameters attrCtxOpExcludeAttrsParam = new AttributeContextParameters();
        attrCtxOpExcludeAttrsParam.setUnder(attrCtx);
        attrCtxOpExcludeAttrsParam.setType(CdmAttributeContextType.OperationExcludeAttributes);
        attrCtxOpExcludeAttrsParam.setName("operation/index" + this.getIndex() + "/operationExcludeAttributes");

        CdmAttributeContext attrCtxOpExcludeAttrs = CdmAttributeContext.createChildUnder(projCtx.getProjectionDirective().getResOpt(), attrCtxOpExcludeAttrsParam);

        // Get the top-level attribute names of the attributes to exclude
        // We use the top-level names because the exclude list may contain a previous name our current resolved attributes had
        Map<String, String> topLevelExcludeAttributeNames = ProjectionResolutionCommonUtil.getTopList(projCtx, this.excludeAttributes);

        // Initialize a projection attribute context tree builder with the created attribute context for the operation
        ProjectionAttributeContextTreeBuilder attrCtxTreeBuilder = new ProjectionAttributeContextTreeBuilder(attrCtxOpExcludeAttrs);

        // Iterate through all the projection attribute states generated from the source's resolved attributes
        // Each projection attribute state contains a resolved attribute that it is corresponding to
        for (ProjectionAttributeState currentPAS : projCtx.getCurrentAttributeStateSet().getStates()) {
            // Check if the current projection attribute state's resolved attribute is in the list of attributes to exclude
            // If this attribute is not in the exclude list, then we are including it in the output
            if (!topLevelExcludeAttributeNames.containsKey(currentPAS.getCurrentResolvedAttribute().getResolvedName())) {
                // Create the attribute context parameters and just store it in the builder for now
                // We will create the attribute contexts at the end
                attrCtxTreeBuilder.createAndStoreAttributeContextParameters(null, currentPAS, currentPAS.getCurrentResolvedAttribute(), CdmAttributeContextType.AttributeDefinition);

                // Create a projection attribute state for the included attribute by creating a copy of the current state
                // Copy() sets the current state as the previous state for the new one
                // We only create projection attribute states for attributes that are not in the exclude list
                ProjectionAttributeState newPAS = currentPAS.copy();

                projOutputSet.add(newPAS);
            } else {
                // The current projection attribute state's resolved attribute is in the exclude list

                // Get the attribute name the way it appears in the exclude list
                String excludeAttributeName = topLevelExcludeAttributeNames.get(currentPAS.getCurrentResolvedAttribute().getResolvedName());

                // Create the attribute context parameters and just store it in the builder for now
                // We will create the attribute contexts at the end
                attrCtxTreeBuilder.createAndStoreAttributeContextParameters(excludeAttributeName, currentPAS, currentPAS.getCurrentResolvedAttribute(), CdmAttributeContextType.AttributeDefinition);
            }
        }

        // Create all the attribute contexts and construct the tree
        attrCtxTreeBuilder.constructAttributeContextTree(projCtx);

        return projOutputSet;
    }
}