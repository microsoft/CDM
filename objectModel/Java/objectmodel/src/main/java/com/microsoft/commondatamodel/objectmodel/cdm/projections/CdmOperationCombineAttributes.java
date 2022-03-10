// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projections;

import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.enums.CdmAttributeContextType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmOperationType;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttribute;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections.*;
import com.microsoft.commondatamodel.objectmodel.utilities.*;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Class to handle CombineAttributes operations
 */
public class CdmOperationCombineAttributes extends CdmOperationBase {
    private static final String TAG = CdmOperationCombineAttributes.class.getSimpleName();
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
        if (resOpt == null) {
            resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
        }

        CdmOperationCombineAttributes copy = host == null ? new CdmOperationCombineAttributes(this.getCtx()) : (CdmOperationCombineAttributes)host;

        if (this.select != null) {
            copy.setSelect(new ArrayList<String>(this.select));
        }
        copy.setMergeInto((CdmTypeAttributeDefinition)this.getMergeInto().copy(resOpt));

        this.copyProj(resOpt, copy);
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

        if (this.getMergeInto() != null
                && this.getMergeInto()
                .visit(path + "/mergeInto/", preChildren, postChildren)) {
            return true;
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
        // Also, create a single list of leaf level PAS
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
            if (leafLevelCombineAttributeNames.containsKey(currentPAS.getCurrentResolvedAttribute().getResolvedName())) {
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
            // the merged attribute needs one new place to live, so here it is
            AttributeContextParameters mergedAttrCtxParam = new AttributeContextParameters();
            mergedAttrCtxParam.setUnder(attrCtxOpCombineAttrs);
            mergedAttrCtxParam.setType(CdmAttributeContextType.AttributeDefinition);
            mergedAttrCtxParam.setName(mergeIntoAttribute.getName());
            CdmAttributeContext mergedAttrCtx = CdmAttributeContext.createChildUnder(projCtx.getProjectionDirective().getResOpt(), mergedAttrCtxParam);

            // Create new resolved attribute, set the new attribute as target
            ResolvedAttribute raNewMergeInto = createNewResolvedAttribute(projCtx, mergedAttrCtx, mergeIntoAttribute, null);

            // Create new output projection attribute state set
            ProjectionAttributeState newMergeIntoPAS = new ProjectionAttributeState(projAttrStateSet.getCtx());
            newMergeIntoPAS.setCurrentResolvedAttribute(raNewMergeInto);
            newMergeIntoPAS.setPreviousStateList(pasMergeList);

            LinkedHashSet<String> attributesAddedToContext = new LinkedHashSet<String>();

            // Create the attribute context parameters and just store it in the builder for now
            // We will create the attribute contexts at the end
            for (String select : leafLevelCombineAttributeNames.keySet()) {
                if (leafLevelCombineAttributeNames.containsKey(select) &&
                        leafLevelCombineAttributeNames.get(select) != null &&
                        leafLevelCombineAttributeNames.get(select).size() > 0) {
                    for (ProjectionAttributeState leafLevelForSelect : leafLevelCombineAttributeNames.get(select)) {
                        // When dealing with a polymorphic entity, it is possible that multiple entities have an attribute with the same name
                            // Only one attribute with each name should be added otherwise the attribute context will end up with duplicated nodes
                            if (!attributesAddedToContext.contains(leafLevelForSelect.getCurrentResolvedAttribute().getResolvedName())) {
                                attributesAddedToContext.add(leafLevelForSelect.getCurrentResolvedAttribute().getResolvedName());
                                attrCtxTreeBuilder.createAndStoreAttributeContextParameters(
                                    select,
                                    leafLevelForSelect,
                                    newMergeIntoPAS.getCurrentResolvedAttribute(),
                                    CdmAttributeContextType.AttributeDefinition,
                                    leafLevelForSelect.getCurrentResolvedAttribute().getAttCtx(), // lineage is the source att
                                    newMergeIntoPAS.getCurrentResolvedAttribute().getAttCtx()); // merge into points back here
                            }
                    }
                }
            }

            projAttrStateSet.add(newMergeIntoPAS);
        }

        // Create all the attribute contexts and construct the tree
        attrCtxTreeBuilder.constructAttributeContextTree(projCtx);

        return projAttrStateSet;
    }
}
