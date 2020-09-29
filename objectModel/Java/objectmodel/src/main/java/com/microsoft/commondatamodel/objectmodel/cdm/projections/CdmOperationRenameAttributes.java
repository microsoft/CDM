// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projections;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttribute;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObject;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObjectBase;
import com.microsoft.commondatamodel.objectmodel.enums.CdmAttributeContextType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmOperationType;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttribute;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections.*;
import com.microsoft.commondatamodel.objectmodel.utilities.*;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * Class to handle RenameAttributes operations
 */
public class CdmOperationRenameAttributes extends CdmOperationBase {
    private String TAG = CdmOperationRenameAttributes.class.getSimpleName();
    private String renameFormat;
    private List<String> applyTo;

    public CdmOperationRenameAttributes(final CdmCorpusContext ctx) {
        super(ctx);
        this.setObjectType(CdmObjectType.OperationRenameAttributesDef);
        this.setType(CdmOperationType.RenameAttributes);
    }

    @Override
    public CdmObject copy(ResolveOptions resOpt, CdmObject host) {
        List<String> applyTo = null;
        if (this.applyTo != null) {
            applyTo = new ArrayList<String>(this.applyTo);
        }

        CdmOperationRenameAttributes copy = new CdmOperationRenameAttributes(this.getCtx());
        copy.renameFormat = this.renameFormat;
        copy.applyTo = applyTo;
        return copy;
    }

    public String getRenameFormat() {
        return renameFormat;
    }

    public void setRenameFormat(final String renameFormat) {
        this.renameFormat = renameFormat;
    }

    public List<String> getApplyTo() {
        return applyTo;
    }

    public void setApplyTo(final List<String> applyTo) {
        this.applyTo = applyTo;
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Override
    @Deprecated
    public Object copyData(final ResolveOptions resOpt, final CopyOptions options) {
        return CdmObjectBase.copyData(this, resOpt, options, CdmOperationRenameAttributes.class);
    }

    @Override
    public String getName() {
        return "operationRenameAttributes";
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Override
    @Deprecated
    public CdmObjectType getObjectType() {
        return CdmObjectType.OperationRenameAttributesDef;
    }

    @Override
    public boolean validate() {
        ArrayList<String> missingFields = new ArrayList<>();

        if (StringUtils.isNullOrTrimEmpty(this.renameFormat)) {
            missingFields.add("renameFormat");
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
                path = pathFrom + "operationRenameAttributes";
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
        AttributeContextParameters attrCtxOpRenameAttrsParam = new AttributeContextParameters();
        attrCtxOpRenameAttrsParam.setUnder(attrCtx);
        attrCtxOpRenameAttrsParam.setType(CdmAttributeContextType.OperationExcludeAttributes);
        attrCtxOpRenameAttrsParam.setName("operation/index" + this.getIndex() + "/operationRenameAttributes");

        CdmAttributeContext attrCtxOpRenameAttrs = CdmAttributeContext.createChildUnder(projCtx.getProjectionDirective().getResOpt(), attrCtxOpRenameAttrsParam);

        // Get the list of attributes that will be renamed
        List<String> renameAttributes;
        if (this.applyTo != null) {
            renameAttributes = this.applyTo;
        } else {
            renameAttributes = new ArrayList<String>();
            for (ProjectionAttributeState currentPAS : projCtx.getCurrentAttributeStateSet().getStates()) {
                renameAttributes.add(currentPAS.getCurrentResolvedAttribute().getResolvedName());
            }
        }

        // Get the top-level attribute names of the attributes to rename
        // We use the top-level names because the rename list may contain a previous name our current resolved attributes had
        Map<String, String> topLevelRenameAttributeNames = ProjectionResolutionCommonUtil.getTopList(projCtx, renameAttributes);

        String sourceAttributeName = projCtx.getProjectionDirective().getOriginalSourceEntityAttributeName();

        // Initialize a projection attribute context tree builder with the created attribute context for the operation
        ProjectionAttributeContextTreeBuilder attrCtxTreeBuilder = new ProjectionAttributeContextTreeBuilder(attrCtxOpRenameAttrs);

        // Iterate through all the projection attribute states generated from the source's resolved attributes
        // Each projection attribute state contains a resolved attribute that it is corresponding to
        for (ProjectionAttributeState currentPAS : projCtx.getCurrentAttributeStateSet().getStates()) {
            // Check if the current projection attribute state's resolved attribute is in the list of attributes to rename
            // If this attribute is not in the rename list, then we are including it in the output without changes
            if (topLevelRenameAttributeNames.containsKey(currentPAS.getCurrentResolvedAttribute().getResolvedName())) {
                if (currentPAS.getCurrentResolvedAttribute().getTarget() instanceof CdmAttribute) {
                    // The current attribute should be renamed

                    String newAttributeName = this.renameAttribute(currentPAS, sourceAttributeName);

                    // Create new resolved attribute with the new name, set the new attribute as target
                    ResolvedAttribute resAttrNew = createNewResolvedAttribute(projCtx, null, (CdmAttribute) currentPAS.getCurrentResolvedAttribute().getTarget(), newAttributeName, null);

                    // Get the attribute name the way it appears in the applyTo list
                    String applyToName = topLevelRenameAttributeNames.get(currentPAS.getCurrentResolvedAttribute().getResolvedName());

                    // Create the attribute context parameters and just store it in the builder for now
                    // We will create the attribute contexts at the end
                    attrCtxTreeBuilder.createAndStoreAttributeContextParameters(applyToName, currentPAS, resAttrNew, CdmAttributeContextType.AttributeDefinition);

                    // Create a projection attribute state for the renamed attribute by creating a copy of the current state
                    // Copy() sets the current state as the previous state for the new one
                    // We only create projection attribute states for attributes that are in the rename list
                    ProjectionAttributeState newPAS = currentPAS.copy();

                    // Update the resolved attribute to be the new renamed attribute we created
                    newPAS.setCurrentResolvedAttribute(resAttrNew);

                    projOutputSet.add(newPAS);
                } else {
                    Logger.warning(TAG, this.getCtx(), "RenameAttributes is not supported on an attribute group yet.");
                    // Add the attribute without changes
                    projOutputSet.add(currentPAS);
                }
            } else {
                // Pass through
                projOutputSet.add(currentPAS);
            }
        }

        // Create all the attribute contexts and construct the tree
        attrCtxTreeBuilder.constructAttributeContextTree(projCtx, true);

        return projOutputSet;
    }

    /**
     * Renames an attribute with the current renameFormat
     * @param attributeState The attribute state
     * @param sourceAttributeName The parent attribute name (if any
     */
    private String renameAttribute(ProjectionAttributeState attributeState, String sourceAttributeName) {
        String currentAttributeName = attributeState.getCurrentResolvedAttribute().getResolvedName();
        String ordinal = attributeState.getOrdinal() != null ? attributeState.getOrdinal().toString() : "";
        String format = this.renameFormat;

        if (StringUtils.isNullOrTrimEmpty(format))
        {
            Logger.error(TAG, this.getCtx(), "RenameFormat should be set for this operation to work.");
            return "";
        }

        String attributeName = StringUtils.replace(format, 'a', sourceAttributeName);
        attributeName = StringUtils.replace(attributeName, 'o', ordinal);
        attributeName = StringUtils.replace(attributeName, 'm', currentAttributeName);

        return attributeName;
    }
}
