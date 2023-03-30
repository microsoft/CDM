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
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Class to handle ArrayExpansion operations
 */
public class CdmOperationAlterTraits extends CdmOperationBase {
    private static final String TAG = CdmOperationAlterTraits.class.getSimpleName();
    private CdmCollection<CdmTraitReferenceBase> traitsToAdd;
    private CdmCollection<CdmTraitReferenceBase> traitsToRemove;
    private Boolean argumentsContainWildcards;
    private List<String> applyTo;
    private List<String> applyToTraits;
    // this cache is for all the traits we might get profiles about. because once is enough
    private TraitProfileCache profCache = new TraitProfileCache();

    public CdmOperationAlterTraits(final CdmCorpusContext ctx) {
        super(ctx);
        this.setObjectType(CdmObjectType.OperationAlterTraitsDef);
        this.setType(CdmOperationType.AlterTraits);
    }

    public CdmCollection<CdmTraitReferenceBase> getTraitsToAdd() {
        return traitsToAdd;
    }

    public void setTraitsToAdd(final CdmCollection<CdmTraitReferenceBase> traitsToAdd) {
        this.traitsToAdd = traitsToAdd;
    }

    public CdmCollection<CdmTraitReferenceBase> getTraitsToRemove() {
        return traitsToRemove;
    }

    public void setTraitsToRemove(final CdmCollection<CdmTraitReferenceBase> traitsToRemove) {
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

    public List<String> getApplyToTraits() {
        return this.applyToTraits;
    }

    public void setApplyToTraits(final List<String> applyToTraits) {
        this.applyToTraits = applyToTraits;
    }

    @Override
    public CdmObject copy(ResolveOptions resOpt, CdmObject host) {
        if (resOpt == null) {
            resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
        }

        CdmOperationAlterTraits copy = host == null ? new CdmOperationAlterTraits(this.getCtx()) : (CdmOperationAlterTraits)host;

        if (this.getTraitsToAdd() != null && this.getTraitsToAdd().size() > 0) {
            for (CdmTraitReferenceBase trait : this.getTraitsToAdd()) {
                copy.getTraitsToAdd().add((CdmTraitReferenceBase) trait.copy());
            }
        }

        if (this.getTraitsToRemove() != null && this.getTraitsToRemove().size() > 0) {
            for (CdmTraitReferenceBase trait : this.getTraitsToRemove()) {
                copy.getTraitsToRemove().add((CdmTraitReferenceBase) trait.copy());
            }
        }

        if (this.applyTo != null) {
            copy.setApplyTo(new ArrayList<String>(this.applyTo));
        }

        if (this.applyToTraits != null) {
            copy.setApplyToTraits(new ArrayList<String>(this.applyToTraits));
        }

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

        if (this.getTraitsToAdd() != null && this.getTraitsToAdd().visitList(path + "/traitsToAdd/", preChildren, postChildren)) {
            return true;
        }

        if (this.getTraitsToRemove() != null && this.getTraitsToRemove().visitList(path + "/traitsToRemove/", preChildren, postChildren)) {
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

        // if set, make a hashset of trait names that need to be removed
        Set<String> traitNamesToRemove = new HashSet<String>();
        if (this.traitsToRemove != null) {
            for (CdmTraitReferenceBase traitRef : this.traitsToRemove) {
                // resolve this because it could be a traitgroup name and turn into many other traits
                ResolvedTraitSet resolvedTraitSet = traitRef.fetchResolvedTraits(projCtx.getProjectionDirective().getResOpt());
                resolvedTraitSet.getSet().forEach((ResolvedTrait rt) -> {traitNamesToRemove.add(rt.getTraitName());});
            }
        }

        // if set, make a hashset from the applyToTraits for fast lookup later
        HashSet<String> applyToTraitNames = null;
        if (this.applyToTraits != null) {
            applyToTraitNames = new HashSet<String>(this.applyToTraits);
        }

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

                ResolvedAttribute foundNewResAttr = null;

                if (currentPAS.getCurrentResolvedAttribute().getTarget() instanceof ResolvedAttributeSet) {
                    // Attribute group
                    // Create a copy of resolved attribute set
                    ResolvedAttributeSet resAttrNewCopy = ((ResolvedAttributeSet)currentPAS.getCurrentResolvedAttribute().getTarget()).copy();
                    foundNewResAttr = new ResolvedAttribute(projCtx.getProjectionDirective().getResOpt(), resAttrNewCopy, currentPAS.getCurrentResolvedAttribute().getResolvedName(), attrCtxNewAttr);

                    // the resolved attribute group obtained from previous projection operation may have a different set of traits comparing to the resolved attribute target.
                    // We would want to take the set of traits from the resolved attribute.
                    foundNewResAttr.setResolvedTraits(currentPAS.getCurrentResolvedAttribute().getResolvedTraits().deepCopy());
                } else if (currentPAS.getCurrentResolvedAttribute().getTarget() instanceof CdmAttribute) {
                    // Entity Attribute or Type Attribute
                    foundNewResAttr = createNewResolvedAttribute(projCtx, attrCtxNewAttr, currentPAS.getCurrentResolvedAttribute(), currentPAS.getCurrentResolvedAttribute().getResolvedName(), null);
                } else {
                    Logger.error(this.getCtx(), TAG, "appendProjectionAttributeState", this.getAtCorpusPath(), CdmLogCode.ErrProjUnsupportedSource, ((CdmObject)currentPAS.getCurrentResolvedAttribute().getTarget()).getObjectType().toString(), this.getName());
                    // Add the attribute without changes
                    projOutputSet.add(currentPAS);
                    break;
                }
                final ResolvedAttribute newResAttr = foundNewResAttr;

                ResolvedTraitSet newTraits = this.resolvedNewTraits(projCtx, currentPAS);
                // if the applyToTraits property was set, then these traits apply to the traits of the selected attributes, else to the attribute directly
                if (applyToTraitNames == null) {
                    // alter traits of atts
                    newResAttr.setResolvedTraits(newResAttr.getResolvedTraits().mergeSet(newTraits));
                    // remove if requested
                    if (traitNamesToRemove != null) {
                        traitNamesToRemove.forEach((String traitName) -> {newResAttr.getResolvedTraits().remove(projCtx.getProjectionDirective().getResOpt(), traitName);});
                    }
                } 
                else {
                    // alter traits of traits of atts
                    // for every current resolved trait on this attribute, find the ones that match the criteria.
                    // a match is the trait name or extended name or any classifications set on it
                    // will need trait references for these resolved traits because metatraits are 'un resolved'
                    List<CdmTraitReference> newTraitRefs = new ArrayList<CdmTraitReference>();
                    for(ResolvedTrait nrt : newTraits.getSet()) {
                        newTraitRefs.add(CdmObjectBase.resolvedTraitToTraitRef(projCtx.getProjectionDirective().getResOpt(), nrt));
                    }

                    for (ResolvedTrait rt : newResAttr.getResolvedTraits().getSet()) {
                        // so get a hashset of the 'tokens' that classify this trait
                        Set<String> classifiers = new HashSet<String>();
                        // this profile lists the classifiers and all base traits
                        TraitProfile profile = rt.fetchTraitProfile(projCtx.getProjectionDirective().getResOpt(), this.profCache, null);
                        if (profile != null) {
                            profile = profile.consolidate(this.profCache);
                            // all classifications 
                            if (profile.getClassifications() != null) {
                                profile.getClassifications().parallelStream().map((c) -> c.getTraitName()).forEach(classifiers::add);
                            }
                            while (profile != null) {
                                classifiers.add(profile.getTraitName());
                                profile = profile.getIS_A();
                            }
                        }

                        //is there an intersection between the set of things to look for and the set of things that describe the trait?
                        Set<String> classifiersCheck = new HashSet<String>(classifiers);
                        classifiersCheck.retainAll(applyToTraitNames);
                        if (classifiersCheck.size() > 0) {
                            // add the specified and fixed up traits to the metatraits of the resolved
                            if (newTraitRefs != null && newTraitRefs.size() > 0) {
                                if (rt.getMetaTraits() == null)
                                    rt.setMetaTraits(new ArrayList<CdmTraitReferenceBase>());
                                rt.getMetaTraits().addAll(newTraitRefs);
                            }
                            // remove some?
                            if (traitNamesToRemove != null && traitNamesToRemove.size() > 0 && rt.getMetaTraits() != null) {
                                List<CdmTraitReferenceBase> toRemove = rt.getMetaTraits().parallelStream()
                                                                        .filter( mtr-> traitNamesToRemove.contains(mtr.fetchObjectDefinitionName()))
                                                                        .collect(Collectors.toList());
                                rt.getMetaTraits().removeAll(toRemove);
                                if (rt.getMetaTraits().size() == 0) {
                                    rt.setMetaTraits(null);
                                }
                            }
                        }
                    }
                }

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

        if (this.traitsToAdd != null) {
            for (CdmTraitReferenceBase traitRef : this.traitsToAdd) {
                final ResolvedTraitSet traitRefCopy = traitRef.fetchResolvedTraits(projCtx.getProjectionDirective().getResOpt()).deepCopy();
                this.replaceWildcardCharacters(projCtx.getProjectionDirective().getResOpt(), traitRefCopy, projectionOwnerName, currentPAS);
                resolvedTraitSet = resolvedTraitSet.mergeSet(traitRefCopy);
            }
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
