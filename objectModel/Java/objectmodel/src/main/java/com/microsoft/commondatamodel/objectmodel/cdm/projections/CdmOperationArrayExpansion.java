// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projections;

import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.enums.CdmAttributeContextType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmOperationType;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttribute;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttributeSet;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections.ProjectionAttributeState;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections.ProjectionAttributeStateSet;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections.ProjectionContext;
import com.microsoft.commondatamodel.objectmodel.utilities.*;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Class to handle ArrayExpansion operations
 */
public class CdmOperationArrayExpansion extends CdmOperationBase {
    private static final String TAG = CdmOperationArrayExpansion.class.getSimpleName();
    private Integer startOrdinal;
    private Integer endOrdinal;

    public CdmOperationArrayExpansion(final CdmCorpusContext ctx) {
        super(ctx);
        this.setObjectType(CdmObjectType.OperationArrayExpansionDef);
        this.setType(CdmOperationType.ArrayExpansion);
    }

    public Integer getStartOrdinal() {
        return startOrdinal;
    }

    public void setStartOrdinal(final Integer startOrdinal) {
        this.startOrdinal = startOrdinal;
    }

    public Integer getEndOrdinal() {
        return endOrdinal;
    }

    public void setEndOrdinal(final Integer endOrdinal) {
        this.endOrdinal = endOrdinal;
    }

    @Override
    public CdmObject copy(ResolveOptions resOpt, CdmObject host) {
        if (resOpt == null) {
            resOpt = new ResolveOptions(this, this.getCtx().getCorpus().getDefaultResolutionDirectives());
        }

        CdmOperationArrayExpansion copy = host == null ? new CdmOperationArrayExpansion(this.getCtx()) : (CdmOperationArrayExpansion)host;

        copy.setStartOrdinal(this.getStartOrdinal());
        copy.setEndOrdinal(this.getEndOrdinal());

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
        return CdmObjectBase.copyData(this, resOpt, options, CdmOperationArrayExpansion.class);
    }

    @Override
    public String getName() {
        return "operationArrayExpansion";
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Override
    @Deprecated
    public CdmObjectType getObjectType() {
        return CdmObjectType.OperationArrayExpansionDef;
    }

    @Override
    public boolean validate() {
        ArrayList<String> missingFields = new ArrayList<>();

        if (this.startOrdinal == null) {
            missingFields.add("startOrdinal");
        }
        if (this.endOrdinal == null) {
            missingFields.add("endOrdinal");
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
        AttributeContextParameters attrCtxOpArrayExpansionParam = new AttributeContextParameters();
        attrCtxOpArrayExpansionParam.setUnder(attrCtx);
        attrCtxOpArrayExpansionParam.setType(CdmAttributeContextType.OperationArrayExpansion);
        attrCtxOpArrayExpansionParam.setName("operation/index" + this.getIndex() + "/operationArrayExpansion");
        CdmAttributeContext attrCtxOpArrayExpansion = CdmAttributeContext.createChildUnder(projCtx.getProjectionDirective().getResOpt(), attrCtxOpArrayExpansionParam);

        // Expansion steps start at round 0
        int round = 0;
        List<ProjectionAttributeState> projAttrStatesFromRounds = new ArrayList<>();

        // Ordinal validation
        if (this.startOrdinal > this.endOrdinal) {
            Logger.warning(this.getCtx(), TAG,
                    "appendProjectionAttributeState",
                    this.getAtCorpusPath(),
                    CdmLogCode.WarnValdnOrdinalStartEndOrder,
                    this.startOrdinal.toString(),
                    this.endOrdinal.toString());
        } else {
            // Ordinals should start at startOrdinal or 0, whichever is larger.
            int startingOrdinal = Math.max(0, this.startOrdinal);

            // Ordinals should end at endOrdinal or the maximum ordinal allowed (set in resolve options), whichever is smaller.
            if (this.endOrdinal > projCtx.getProjectionDirective().getResOpt().getMaxOrdinalForArrayExpansion()) {
                Logger.warning(
                        this.getCtx(),
                        TAG,
                        "appendProjectionAttributeState",
                        this.getAtCorpusPath(),
                        CdmLogCode.WarnValdnMaxOrdinalTooHigh,
                        this.endOrdinal.toString(),
                        String.valueOf(projCtx.getProjectionDirective().getResOpt().getMaxOrdinalForArrayExpansion()));

            }
            int endingOrdinal = Math.min(projCtx.getProjectionDirective().getResOpt().getMaxOrdinalForArrayExpansion(), this.endOrdinal);

            // For each ordinal, create a copy of the input resolved attribute
            for (int i = startingOrdinal; i <= endingOrdinal; i++) {
                // Create a new attribute context for the round
                AttributeContextParameters attrCtxRoundParam = new AttributeContextParameters();
                attrCtxRoundParam.setUnder(attrCtxOpArrayExpansion);
                attrCtxRoundParam.setType(CdmAttributeContextType.GeneratedRound);
                attrCtxRoundParam.setName("_generatedAttributeRound" + round);
                CdmAttributeContext attrCtxRound = CdmAttributeContext.createChildUnder(projCtx.getProjectionDirective().getResOpt(), attrCtxRoundParam);

                // Iterate through all the projection attribute states generated from the source's resolved attributes
                // Each projection attribute state contains a resolved attribute that it is corresponding to
                for (ProjectionAttributeState currentPAS : projCtx.getCurrentAttributeStateSet().getStates()) {
                    // Create a new attribute context for the expanded attribute with the current ordinal
                    AttributeContextParameters attrCtxExpandedAttrParam = new AttributeContextParameters();
                    attrCtxExpandedAttrParam.setUnder(attrCtxRound);
                    attrCtxExpandedAttrParam.setType(CdmAttributeContextType.AttributeDefinition);
                    attrCtxExpandedAttrParam.setName(currentPAS.getCurrentResolvedAttribute().getResolvedName() + "@" + i);
                    CdmAttributeContext attrCtxExpandedAttr = CdmAttributeContext.createChildUnder(projCtx.getProjectionDirective().getResOpt(), attrCtxExpandedAttrParam);

                    if (currentPAS.getCurrentResolvedAttribute().getTarget() instanceof ResolvedAttributeSet) {
                        Logger.error(this.getCtx(), TAG, "appendProjectionAttributeState", this.getAtCorpusPath(), CdmLogCode.ErrProjUnsupportedAttrGroups);
                        projAttrStatesFromRounds.clear();
                        break;
                    }

                    // Create a new resolved attribute for the expanded attribute
                    ResolvedAttribute newResAttr = createNewResolvedAttribute(projCtx, attrCtxExpandedAttr, currentPAS.getCurrentResolvedAttribute(), currentPAS.getCurrentResolvedAttribute().getResolvedName());

                    // Create a projection attribute state for the expanded attribute
                    ProjectionAttributeState newPAS = new ProjectionAttributeState(projOutputSet.getCtx());
                    newPAS.setCurrentResolvedAttribute(newResAttr);
                    newPAS.setPreviousStateList(new ArrayList<>(Collections.singletonList(currentPAS)));
                    newPAS.setOrdinal(i);

                    projAttrStatesFromRounds.add(newPAS);
                }

                if (i == endingOrdinal) {
                    break;
                }

                // Increment the round
                round++;
            }
        }

        if (projAttrStatesFromRounds.size() == 0) {
            // No rounds were produced from the array expansion - input passes through
            for (ProjectionAttributeState pas : projCtx.getCurrentAttributeStateSet().getStates()) {
                projOutputSet.add(pas);
            }
        } else {
            // Add all the projection attribute states containing the expanded attributes to the output
            for (ProjectionAttributeState pas : projAttrStatesFromRounds) {
                projOutputSet.add(pas);
            }
        }

        return projOutputSet;
    }
}
