// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projections;

import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.enums.CdmAttributeContextType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmOperationType;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttribute;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedTrait;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections.*;
import com.microsoft.commondatamodel.objectmodel.utilities.*;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Class to handle CombineAttributes operations
 */
public class CdmOperationCombineAttributes extends CdmOperationBase {
    private String TAG = CdmOperationCombineAttributes.class.getSimpleName();
    private List<String> select;
    private CdmTypeAttributeDefinition mergeInto;

    public CdmOperationCombineAttributes(final CdmCorpusContext ctx) {
        super(ctx);
        this.setObjectType(CdmObjectType.OperationCombineAttributesDef);
        this.setType(CdmOperationType.CombineAttributes);

        this.select = new ArrayList<String>();
    }

    @Override
    public CdmObject copy(ResolveOptions resOpt, CdmObject host) {
        CdmOperationCombineAttributes copy = new CdmOperationCombineAttributes(this.getCtx());
        copy.select = (this.select != null) ? new ArrayList<String>(this.select) :  null;
        copy.mergeInto = (this.mergeInto != null) ? (CdmTypeAttributeDefinition) this.mergeInto.copy(resOpt, host) : null;
        return copy;
    }

    public List<String> getSelect() {
        return select;
    }

    public void setSelect(final List<String> select) {
        this.select = select;
    }

    public CdmTypeAttributeDefinition getMergeInto() {
        return mergeInto;
    }

    public void setMergeInto(final CdmTypeAttributeDefinition mergeInto) {
        this.mergeInto = mergeInto;
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Override
    @Deprecated
    public Object copyData(final ResolveOptions resOpt, final CopyOptions options) {
        return CdmObjectBase.copyData(this, resOpt, options, CdmOperationCombineAttributes.class);
    }

    @Override
    public String getName() {
        return "operationCombineAttributes";
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Override
    @Deprecated
    public CdmObjectType getObjectType() {
        return CdmObjectType.OperationCombineAttributesDef;
    }

    @Override
    public boolean validate() {
        ArrayList<String> missingFields = new ArrayList<>();

        if (this.select == null) {
            missingFields.add("select");
        }
        if (this.mergeInto == null) {
            missingFields.add("mergeInto");
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
                path = pathFrom + "operationCombineAttributes";
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
        AttributeContextParameters attrCtxOpCombineAttrsParam = new AttributeContextParameters();
        attrCtxOpCombineAttrsParam.setUnder(attrCtx);
        attrCtxOpCombineAttrsParam.setType(CdmAttributeContextType.OperationCombineAttributes);
        attrCtxOpCombineAttrsParam.setName("operation/index" + this.getIndex() + "/operationCombineAttributes");
        CdmAttributeContext attrCtxOpCombineAttrs = CdmAttributeContext.createChildUnder(projCtx.getProjectionDirective().getResOpt(), attrCtxOpCombineAttrsParam);

        // Initialize a projection attribute context tree builder with the created attribute context for the operation
        ProjectionAttributeContextTreeBuilder attrCtxTreeBuilder = new ProjectionAttributeContextTreeBuilder(attrCtxOpCombineAttrs);

        // Get all the leaf level PAS nodes from the tree for each selected attribute and cache to a dictionary
        Map<String, List<ProjectionAttributeState>> leafLevelCombineAttributeNames = new LinkedHashMap();
        // Also, create a single list of leaf level PAS to add to the 'is.linkedEntity.identifier' trait parameter
        List<ProjectionAttributeState> leafLevelMergePASList = new ArrayList<ProjectionAttributeState>();
        for (String select : this.select) {
            List<ProjectionAttributeState> leafLevelListForCurrentSelect = ProjectionResolutionCommonUtil.getLeafList(projCtx, select);
            if (leafLevelListForCurrentSelect != null &&
                    leafLevelListForCurrentSelect.size() > 0 &&
                    !leafLevelCombineAttributeNames.containsKey(select)) {
                leafLevelCombineAttributeNames.put(select, leafLevelListForCurrentSelect);

                leafLevelMergePASList.addAll(leafLevelListForCurrentSelect);
            }
        }

        // Create a List of top-level PAS objects that will be get merged based on the selected attributes
        List<ProjectionAttributeState> pasMergeList = new ArrayList<ProjectionAttributeState>();

        // Run through the top-level PAS objects
        for (ProjectionAttributeState currentPAS : projCtx.getCurrentAttributeStateSet().getStates()) {
            if ((projCtx.getProjectionDirective().getOwnerType() == CdmObjectType.EntityDef ||
                    projCtx.getProjectionDirective().getIsSourcePolymorphic()) &&
                    leafLevelCombineAttributeNames.containsKey(currentPAS.getCurrentResolvedAttribute().getResolvedName())) {
                // Attribute to Merge

                if (!pasMergeList.contains(currentPAS)) {
                    pasMergeList.add(currentPAS);
                }
            } else {
                // Attribute to Pass Through

                // Create a projection attribute state for the non-selected / pass-through attribute by creating a copy of the current state
                // Copy() sets the current state as the previous state for the new one
                ProjectionAttributeState newPAS = currentPAS.copy();

                projAttrStateSet.add(newPAS);
            }
        }

        if (pasMergeList.size() > 0) {
            CdmTypeAttributeDefinition mergeIntoAttribute = (CdmTypeAttributeDefinition) this.mergeInto;
            List<String> addTrait = new ArrayList<String>();
            addTrait.add("is.linkedEntity.identifier");

            // Create new resolved attribute, set the new attribute as target, and apply "is.linkedEntity.identifier" trait
            ResolvedAttribute raNewMergeInto = createNewResolvedAttribute(projCtx, attrCtxOpCombineAttrs, mergeIntoAttribute, null, addTrait);

            // update the new foreign key resolved attribute with trait param with reference details
            ResolvedTrait reqdTrait = raNewMergeInto.fetchResolvedTraits().find(projCtx.getProjectionDirective().getResOpt(), "is.linkedEntity.identifier");
            if (reqdTrait != null) {
                CdmEntityReference traitParamEntRef = ProjectionResolutionCommonUtil.createForeignKeyLinkedEntityIdentifierTraitParameter(projCtx.getProjectionDirective(), projAttrStateSet.getCtx().getCorpus(), leafLevelMergePASList);
                reqdTrait.getParameterValues().setParameterValue(projCtx.getProjectionDirective().getResOpt(), "entityReferences", traitParamEntRef);
            }

            // Create new output projection attribute state set for FK and add prevPas as previous state set
            ProjectionAttributeState newMergeIntoPAS = new ProjectionAttributeState(projAttrStateSet.getCtx());
            newMergeIntoPAS.setCurrentResolvedAttribute(raNewMergeInto);
            newMergeIntoPAS.setPreviousStateList(pasMergeList);

            // Create the attribute context parameters and just store it in the builder for now
            // We will create the attribute contexts at the end
            for (String select : leafLevelCombineAttributeNames.keySet()) {
                if (leafLevelCombineAttributeNames.containsKey(select) &&
                        leafLevelCombineAttributeNames.get(select) != null &&
                        leafLevelCombineAttributeNames.get(select).size() > 0) {
                    for (ProjectionAttributeState leafLevelForSelect : leafLevelCombineAttributeNames.get(select)) {
                        attrCtxTreeBuilder.createAndStoreAttributeContextParameters(select, leafLevelForSelect, newMergeIntoPAS.getCurrentResolvedAttribute(), CdmAttributeContextType.AttributeDefinition);
                    }
                }
            }

            projAttrStateSet.add(newMergeIntoPAS);
        }

        // Create all the attribute contexts and construct the tree
        attrCtxTreeBuilder.constructAttributeContextTree(projCtx, true);

        return projAttrStateSet;
    }
}
