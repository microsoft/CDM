// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projections;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObject;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObjectBase;
import com.microsoft.commondatamodel.objectmodel.enums.CdmAttributeContextType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmOperationType;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections.*;
import com.microsoft.commondatamodel.objectmodel.utilities.*;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Class to handle IncludeAttributes operations
 */
public class CdmOperationIncludeAttributes extends CdmOperationBase {
    private String tag = CdmOperationIncludeAttributes.class.getSimpleName();
    private List<String> includeAttributes;

    public CdmOperationIncludeAttributes(final CdmCorpusContext ctx) {
        super(ctx);
        this.setObjectType(CdmObjectType.OperationIncludeAttributesDef);
        this.setType(CdmOperationType.IncludeAttributes);

        this.includeAttributes = new ArrayList<>();
    }

    @Override
    public CdmObject copy(ResolveOptions resOpt, CdmObject host) {
        List<String> includeAttributes = new ArrayList<String>();
        includeAttributes.addAll(this.includeAttributes);

        CdmOperationIncludeAttributes copy = new CdmOperationIncludeAttributes(this.getCtx());
        copy.includeAttributes = includeAttributes;
        return copy;
    }

    public List<String> getIncludeAttributes() {
        return includeAttributes;
    }

    public void setIncludeAttributes(final List<String> includeAttributes) {
        this.includeAttributes = includeAttributes;
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Override
    @Deprecated
    public Object copyData(final ResolveOptions resOpt, final CopyOptions options) {
        return CdmObjectBase.copyData(this, resOpt, options, CdmOperationIncludeAttributes.class);
    }

    @Override
    public String getName() {
        return "operationIncludeAttributes";
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Override
    @Deprecated
    public CdmObjectType getObjectType() {
        return CdmObjectType.OperationIncludeAttributesDef;
    }

    @Override
    public boolean validate() {
        ArrayList<String> missingFields = new ArrayList<>();

        if (this.includeAttributes == null) {
            missingFields.add("includeAttributes");
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
            if (StringUtils.isNullOrEmpty(path)) {
                path = pathFrom + "operationIncludeAttributes";
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
    public ProjectionAttributeStateSet appendProjectionAttributeState(ProjectionContext projCtx, ProjectionAttributeStateSet projAttrStateSet, CdmAttributeContext attrCtx) {
        // Create a new attribute context for the operation
        AttributeContextParameters attrCtxOpIncludeAttrsParam = new AttributeContextParameters();
        attrCtxOpIncludeAttrsParam.setUnder(attrCtx);
        attrCtxOpIncludeAttrsParam.setType(CdmAttributeContextType.OperationIncludeAttributes);
        attrCtxOpIncludeAttrsParam.setName("operation/index" + this.getIndex() + "/operationIncludeAttributes");
        CdmAttributeContext attrCtxOpIncludeAttrs = CdmAttributeContext.createChildUnder(projCtx.getProjectionDirective().getResOpt(), attrCtxOpIncludeAttrsParam);

        // Get the top-level attribute names for each of the included attributes
        // Since the include operation allows providing either current state resolved attribute names
        //   or the previous state resolved attribute names, we search for the name in the PAS tree
        //   and fetch the top level resolved attribute names.
        Map<String, String> topLevelIncludeAttributeNames = ProjectionResolutionCommonUtil.getTopList(projCtx, this.includeAttributes);

        // Initialize a projection attribute context tree builder with the created attribute context for the operation
        ProjectionAttributeContextTreeBuilder attrCtxTreeBuilder = new ProjectionAttributeContextTreeBuilder(attrCtxOpIncludeAttrs);

        // Iterate through all the PAS in the PASSet generated from the projection source's resolved attributes
        for (ProjectionAttributeState currentPAS : projCtx.getCurrentAttributeStateSet().getStates()) {
            // Check if the current PAS's RA is in the list of attributes to include.
            if (topLevelIncludeAttributeNames.containsKey(currentPAS.getCurrentResolvedAttribute().getResolvedName())) {
                // Get the attribute name the way it appears in the include list
                String includeAttributeName = topLevelIncludeAttributeNames.get(currentPAS.getCurrentResolvedAttribute().getResolvedName());

                // Create the attribute context parameters and just store it in the builder for now
                // We will create the attribute contexts at the end
                attrCtxTreeBuilder.createAndStoreAttributeContextParameters(includeAttributeName, currentPAS, currentPAS.getCurrentResolvedAttribute(),
                        CdmAttributeContextType.AttributeDefinition,
                        currentPAS.getCurrentResolvedAttribute().getAttCtx(), // lineage is the included attribute
                        null); // don't know who will point here yet


                // Create a projection attribute state for the included attribute by creating a copy of the current state
                // Copy() sets the current state as the previous state for the new one
                // We only create projection attribute states for attributes in the include list
                ProjectionAttributeState newPAS = currentPAS.copy();

                projAttrStateSet.add(newPAS);
            } else {
                // Create the attribute context parameters and just store it in the builder for now
                // We will create the attribute contexts at the end
                attrCtxTreeBuilder.createAndStoreAttributeContextParameters(null, currentPAS, currentPAS.getCurrentResolvedAttribute(),
                        CdmAttributeContextType.AttributeDefinition,
                        currentPAS.getCurrentResolvedAttribute().getAttCtx(), // lineage is the excluded attribute
                        null); // don't know who will point here, probably nobody, I mean, we got excluded
            }
        }

        // Create all the attribute contexts and construct the tree
        attrCtxTreeBuilder.constructAttributeContextTree(projCtx);

        return projAttrStateSet;
    }
}
