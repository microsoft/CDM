// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projections;

import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.enums.CdmAttributeContextType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmOperationType;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.*;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections.ProjectionAttributeState;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections.ProjectionAttributeStateSet;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections.ProjectionContext;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections.ProjectionResolutionCommonUtil;
import com.microsoft.commondatamodel.objectmodel.utilities.*;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Class to handle ArrayExpansion operations
 */
public class CdmOperationAlterTraits extends CdmOperationBase {
    private static final String TAG = CdmOperationAlterTraits.class.getSimpleName();
    private List<CdmTraitReferenceBase> traitsToAdd;
    private List<CdmTraitReferenceBase> traitsToRemove;
    private Boolean argumentsContainWildcards;
    private List<String> applyTo;

    public CdmOperationAlterTraits(final CdmCorpusContext ctx) {
        super(ctx);
        this.setObjectType(CdmObjectType.OperationAlterTraitsDef);
        this.setType(CdmOperationType.AlterTraits);
    }

    public List<CdmTraitReferenceBase> getTraitsToAdd() {
        return traitsToAdd;
    }

    public void setTraitsToAdd(final List<CdmTraitReferenceBase> traitsToAdd) {
        this.traitsToAdd = traitsToAdd;
    }

    public List<CdmTraitReferenceBase> getTraitsToRemove() {
        return traitsToRemove;
    }

    public void setTraitsToRemove(final List<CdmTraitReferenceBase> traitsToRemove) {
        this.traitsToRemove = traitsToRemove;
    }

    public Boolean getArgumentsContainWildcards() {
        return argumentsContainWildcards;
    }

    public void setArgumentsContainWildcards(final Boolean argumentsContainWildcards) {
        this.argumentsContainWildcards = argumentsContainWildcards;
    }

    public List<String> getApplyTo() {
        return applyTo;
    }

    public void setApplyTo(final List<String> applyTo) {
        this.applyTo = applyTo;
    }

    @Override
    public CdmObject copy(ResolveOptions resOpt, CdmObject host) {
        if (resOpt == null) {
            resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
        }

        CdmOperationAlterTraits copy = host == null ? new CdmOperationAlterTraits(this.getCtx()) : (CdmOperationAlterTraits)host;

        List<CdmTraitReferenceBase> traitsToAdd = null;
        if (this.traitsToAdd != null) {
            traitsToAdd = new ArrayList<CdmTraitReferenceBase>(this.traitsToAdd);
        }

        List<CdmTraitReferenceBase> traitsToRemove = null;
        if (this.traitsToRemove != null) {
            traitsToRemove = new ArrayList<CdmTraitReferenceBase>(this.traitsToRemove);
        }

        if (this.applyTo != null) {
            copy.setApplyTo(new ArrayList<String>(this.applyTo));
        }

        copy.traitsToAdd = traitsToAdd;
        copy.traitsToRemove = traitsToRemove;
        copy.argumentsContainWildcards = this.argumentsContainWildcards;

        this.copyProj(resOpt, copy);
        return copy;
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Override
    @Deprecated
    public Object copyData(final ResolveOptions resOpt, final CopyOptions options) {
        return CdmObjectBase.copyData(this, resOpt, options, CdmOperationAlterTraits.class);
    }

    @Override
    public String getName() {
        return "operationAlterTraits";
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Override
    @Deprecated
    public CdmObjectType getObjectType() {
        return CdmObjectType.OperationAlterTraitsDef;
    }

    @Override
    public boolean validate() {
        ArrayList<String> missingFields = new ArrayList<>();

        // Need to have either traitsToAdd or traitsToRemove
        if (this.traitsToAdd == null && this.traitsToRemove == null)
        {
            missingFields.add("traitsToAdd");
            missingFields.add("traitsToRemove");
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
        AttributeContextParameters attrCtxOpAlterTraitsParam = new AttributeContextParameters();
        attrCtxOpAlterTraitsParam.setUnder(attrCtx);
        attrCtxOpAlterTraitsParam.setType(CdmAttributeContextType.OperationAlterTraits);
        attrCtxOpAlterTraitsParam.setName("operation/index" + this.getIndex() + "/" + this.getName());
        CdmAttributeContext attrCtxOpAlterTraits = CdmAttributeContext.createChildUnder(projCtx.getProjectionDirective().getResOpt(), attrCtxOpAlterTraitsParam);

        // Get the top-level attribute names of the selected attributes to apply
        // We use the top-level names because the applyTo list may contain a previous name our current resolved attributes had
        Map<String, String> topLevelSelectedAttributeNames = this.applyTo != null ? ProjectionResolutionCommonUtil.getTopList(projCtx, this.applyTo) : null;

        for (ProjectionAttributeState currentPAS : projCtx.getCurrentAttributeStateSet().getStates()) {
            // Check if the current projection attribute state's resolved attribute is in the list of selected attributes
            // If this attribute is not in the list, then we are including it in the output without changes
            if (topLevelSelectedAttributeNames == null || topLevelSelectedAttributeNames.containsKey(currentPAS.getCurrentResolvedAttribute().getResolvedName())) {
                // Create a new attribute context for the new attribute we will create
                AttributeContextParameters attrCtxNewAttrParam = new AttributeContextParameters();
                attrCtxNewAttrParam.setUnder(attrCtxOpAlterTraits);
                attrCtxNewAttrParam.setType(CdmAttributeContextType.AttributeDefinition);
                attrCtxNewAttrParam.setName(currentPAS.getCurrentResolvedAttribute().getResolvedName());
                CdmAttributeContext attrCtxNewAttr = CdmAttributeContext.createChildUnder(projCtx.getProjectionDirective().getResOpt(), attrCtxNewAttrParam);

                ResolvedAttribute newResAttr = null;

                if (currentPAS.getCurrentResolvedAttribute().getTarget() instanceof ResolvedAttributeSet) {
                    // Attribute group
                    // Create a copy of resolved attribute set
                    ResolvedAttributeSet resAttrNewCopy = ((ResolvedAttributeSet)currentPAS.getCurrentResolvedAttribute().getTarget()).copy();
                    newResAttr = new ResolvedAttribute(projCtx.getProjectionDirective().getResOpt(), resAttrNewCopy, currentPAS.getCurrentResolvedAttribute().getResolvedName(), attrCtxNewAttr);

                    // the resolved attribute group obtained from previous projection operation may have a different set of traits comparing to the resolved attribute target.
                    // We would want to take the set of traits from the resolved attribute.
                    newResAttr.setResolvedTraits(currentPAS.getCurrentResolvedAttribute().getResolvedTraits().deepCopy());
                } else if (currentPAS.getCurrentResolvedAttribute().getTarget() instanceof CdmAttribute) {
                    // Entity Attribute or Type Attribute
                    newResAttr = createNewResolvedAttribute(projCtx, attrCtxNewAttr, currentPAS.getCurrentResolvedAttribute(), currentPAS.getCurrentResolvedAttribute().getResolvedName(), null);
                } else {
                    Logger.error(this.getCtx(), TAG, "appendProjectionAttributeState", this.getAtCorpusPath(), CdmLogCode.ErrProjUnsupportedSource, ((CdmObject)currentPAS.getCurrentResolvedAttribute().getTarget()).getObjectType().toString(), this.getName());
                    // Add the attribute without changes
                    projOutputSet.add(currentPAS);
                    break;
                }

                newResAttr.setResolvedTraits(newResAttr.getResolvedTraits().mergeSet(this.resolvedNewTraits(projCtx, currentPAS)));
                this.removeTraitsInNewAttribute(projCtx.getProjectionDirective().getResOpt(), newResAttr);

                // Create a projection attribute state for the new attribute with new applied traits by creating a copy of the current state
                // Copy() sets the current state as the previous state for the new one
                ProjectionAttributeState newPAS = currentPAS.copy();

                // Update the resolved attribute to be the new attribute we created
                newPAS.setCurrentResolvedAttribute(newResAttr);

                projOutputSet.add(newPAS);
            } else {
                // Pass through
                projOutputSet.add(currentPAS);
            }
        }

        return projOutputSet;
    }

    /**
     * Get a resolved trait set which contains new resolved traits with placement for wild characters if it's applicable.
     *
     * @param projCtx The current projection context.
     * @param currentPAS The current attribute state set.
     */
    private ResolvedTraitSet resolvedNewTraits(ProjectionContext projCtx, ProjectionAttributeState currentPAS) {
        ResolvedTraitSet resolvedTraitSet = new ResolvedTraitSet(projCtx.getProjectionDirective().getResOpt());
        final String projectionOwnerName = projCtx.getProjectionDirective().getOriginalSourceAttributeName() != null ? projCtx.getProjectionDirective().getOriginalSourceAttributeName() : "";

        for (CdmTraitReferenceBase traitRef : this.traitsToAdd) {
            final ResolvedTraitSet traitRefCopy = traitRef.fetchResolvedTraits(projCtx.getProjectionDirective().getResOpt()).deepCopy();
            this.replaceWildcardCharacters(projCtx.getProjectionDirective().getResOpt(), traitRefCopy, projectionOwnerName, currentPAS);
            resolvedTraitSet = resolvedTraitSet.mergeSet(traitRefCopy);
        }

        return resolvedTraitSet;
    }

    /**
     * Remove traits from the new resolved attribute.
     *
     * @param resOpt The resolve options.
     * @param resolvedTraitSet The new resolved attribute.
     * @param projectionOwnerName The attribute name of projection owner (only available when the owner is an entity attribute or type attribute)
     * @param currentPAS The attribute state.
     */
    private void replaceWildcardCharacters(ResolveOptions resOpt, ResolvedTraitSet resolvedTraitSet, final String projectionOwnerName, final ProjectionAttributeState currentPAS) {
        if (this.argumentsContainWildcards != null && this.argumentsContainWildcards) {
            for (ResolvedTrait resolvedTrait :resolvedTraitSet.getSet()) {
                ParameterValueSet parameterValueSet = resolvedTrait.getParameterValues();
                for (int i = 0; i < parameterValueSet.length(); ++i) {
                    Object value = parameterValueSet.fetchValue(i);
                    if (value instanceof String) {
                        String newVal = replaceWildcardCharacters((String)value, projectionOwnerName, currentPAS);
                        if (!value.equals(newVal)){
                            parameterValueSet.setParameterValue(resOpt, parameterValueSet.fetchParameter(i).getName(), newVal);
                        }
                    }
                }
            }
        }
    }

    /**
     * Remove traits from the new resolved attribute.
     *
     * @param resOpt The resolve options.
     * @param newResAttr The new resolved attribute.
     */
    private void removeTraitsInNewAttribute(ResolveOptions resOpt, ResolvedAttribute newResAttr) {
        HashSet<String> traitNamesToRemove = new HashSet<String>();
        if (this.traitsToRemove != null) {
            for (final CdmTraitReferenceBase traitRef : this.traitsToRemove) {
                ResolvedTraitSet resolvedTraitSet = traitRef.fetchResolvedTraits(resOpt).deepCopy();
                for (final ResolvedTrait rt : resolvedTraitSet.getSet()) {
                    traitNamesToRemove.add(rt.getTraitName());
                }
            }
            for (final String traitName: traitNamesToRemove) {
                newResAttr.getResolvedTraits().remove(resOpt, traitName);
            }
        }
    }
}
