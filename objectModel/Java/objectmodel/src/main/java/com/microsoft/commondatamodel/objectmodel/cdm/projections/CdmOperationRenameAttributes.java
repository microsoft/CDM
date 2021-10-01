// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projections;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttribute;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObject;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObjectBase;
import com.microsoft.commondatamodel.objectmodel.enums.CdmAttributeContextType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmOperationType;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttribute;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections.*;
import com.microsoft.commondatamodel.objectmodel.utilities.*;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Class to handle RenameAttributes operations
 */
public class CdmOperationRenameAttributes extends CdmOperationBase {
    private static final String TAG = CdmOperationRenameAttributes.class.getSimpleName();
    private String renameFormat;
    private List<String> applyTo;

    public CdmOperationRenameAttributes(final CdmCorpusContext ctx) {
        super(ctx);
        this.setObjectType(CdmObjectType.OperationRenameAttributesDef);
        this.setType(CdmOperationType.RenameAttributes);
    }

    @Override
    public CdmObject copy(ResolveOptions resOpt, CdmObject host) {
        if (resOpt == null) {
            resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
        }

        CdmOperationRenameAttributes copy = host == null ? new CdmOperationRenameAttributes(this.getCtx()) : (CdmOperationRenameAttributes)host;

        if (this.applyTo != null) {
            copy.setApplyTo(new ArrayList<String>(this.applyTo));
        }
        copy.renameFormat = this.renameFormat;

        this.copyProj(resOpt, copy);
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
            missingFields.add(this.renameFormat.toString());
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
        AttributeContextParameters attrCtxOpRenameAttrsParam = new AttributeContextParameters();
        attrCtxOpRenameAttrsParam.setUnder(attrCtx);
        attrCtxOpRenameAttrsParam.setType(CdmAttributeContextType.OperationRenameAttributes);
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

                    String newAttributeName = this.getNewAttributeName(projCtx.getProjectionDirective().getOriginalSourceAttributeName(), currentPAS);

                    // Create new resolved attribute with the new name, set the new attribute as target
                    ResolvedAttribute resAttrNew = createNewResolvedAttribute(projCtx, null, currentPAS.getCurrentResolvedAttribute(), newAttributeName, null);

                    // Get the attribute name the way it appears in the applyTo list
                    String applyToName = topLevelRenameAttributeNames.get(currentPAS.getCurrentResolvedAttribute().getResolvedName());

                    // Create the attribute context parameters and just store it in the builder for now
                    // We will create the attribute contexts at the end
                    attrCtxTreeBuilder.createAndStoreAttributeContextParameters(applyToName, currentPAS, resAttrNew,
                            CdmAttributeContextType.AttributeDefinition,
                            currentPAS.getCurrentResolvedAttribute().getAttCtx(), // lineage is the original attribute
                            null); // don't know who will point here yet

                    // Create a projection attribute state for the renamed attribute by creating a copy of the current state
                    // Copy() sets the current state as the previous state for the new one
                    // We only create projection attribute states for attributes that are in the rename list
                    ProjectionAttributeState newPAS = currentPAS.copy();

                    // Update the resolved attribute to be the new renamed attribute we created
                    newPAS.setCurrentResolvedAttribute(resAttrNew);

                    projOutputSet.add(newPAS);
                } else {
                    Logger.warning(this.getCtx(), TAG, "appendProjectionAttributeState", this.getAtCorpusPath(), CdmLogCode.WarnProjRenameAttrNotSupported);
                    // Add the attribute without changes
                    projOutputSet.add(currentPAS);
                }
            } else {
                // Pass through
                projOutputSet.add(currentPAS);
            }
        }

        // Create all the attribute contexts and construct the tree
        attrCtxTreeBuilder.constructAttributeContextTree(projCtx);

        return projOutputSet;
    }

    /**
     * Renames an attribute with the current renameFormat
     * @param projectionOwnerName The attribute name of projection owner (only available when the owner is an entity attribute or type attribute).
     * @param currentPAS The attribute state.
     */
    private String getNewAttributeName(final String projectionOwnerName, final ProjectionAttributeState currentPAS) {
        if (StringUtils.isNullOrTrimEmpty(this.renameFormat))
        {
            Logger.error(this.getCtx(), TAG, "getNewAttributeName", this.getAtCorpusPath(), CdmLogCode.ErrProjRenameFormatIsNotSet);
            return "";
        }

        return replaceWildcardCharacters(this.renameFormat, projectionOwnerName, currentPAS);
    }
}
