// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.projections;

import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmOperationType;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.*;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections.ProjectionAttributeStateSet;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections.ProjectionContext;
import com.microsoft.commondatamodel.objectmodel.utilities.*;

import java.util.List;

/**
 * Base class for all operations
 */
public abstract class CdmOperationBase extends CdmObjectDefinitionBase {
    private int index;
    private CdmOperationType type;

    public CdmOperationBase(final CdmCorpusContext ctx) {
        super(ctx);
    }

    /**
     * The index of an operation
     * In a projection's operation collection, 2 same type of operation may cause duplicate attribute context
     * To avoid that we add an index
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public int getIndex() {
        return index;
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public void setIndex(final int index) {
        this.index = index;
    }

    public CdmOperationType getType() {
        return type;
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public void setType(final CdmOperationType type) {
        this.type = type;
    }

    @Override
    public abstract CdmObject copy(ResolveOptions resOpt, CdmObject host);

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Override
    @Deprecated
    public abstract Object copyData(final ResolveOptions resOpt, final CopyOptions options);

    @Override
    public abstract String getName();

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Override
    @Deprecated
    public abstract CdmObjectType getObjectType();

    @Override
    public abstract boolean isDerivedFrom(final String baseDef, ResolveOptions resOpt);

    @Override
    public abstract boolean validate();

    @Override
    public abstract boolean visit(final String pathFrom, final VisitCallback preChildren, final VisitCallback postChildren);

    /**
     * A function to cumulate the projection attribute states
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public abstract ProjectionAttributeStateSet appendProjectionAttributeState(ProjectionContext projCtx, ProjectionAttributeStateSet projAttrStateSet, CdmAttributeContext attrCtx);

    /**
     * Projections require a new resolved attribute to be created multiple times
     * This function allows us to create new resolved attributes based on a input attribute
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public static ResolvedAttribute createNewResolvedAttribute(ProjectionContext projCtx, CdmAttributeContext attrCtxUnder, CdmAttribute targetAttr) {
        return createNewResolvedAttribute(projCtx, attrCtxUnder, targetAttr, null);
    }

    /**
     * Projections require a new resolved attribute to be created multiple times
     * This function allows us to create new resolved attributes based on a input attribute
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public static ResolvedAttribute createNewResolvedAttribute(ProjectionContext projCtx, CdmAttributeContext attrCtxUnder, CdmAttribute targetAttr, String overrideDefaultName) {
        return createNewResolvedAttribute(projCtx, attrCtxUnder, targetAttr, overrideDefaultName, null);
    }

    /**
     * Projections require a new resolved attribute to be created multiple times
     * This function allows us to create new resolved attributes based on a input attribute
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public static ResolvedAttribute createNewResolvedAttribute(ProjectionContext projCtx, CdmAttributeContext attrCtxUnder, CdmAttribute targetAttr, String overrideDefaultName, List<String> addedSimpleRefTraits) {
        ResolvedAttribute newResAttr = new ResolvedAttribute(
            projCtx.getProjectionDirective().getResOpt(),
            targetAttr,
            !StringUtils.isNullOrTrimEmpty(overrideDefaultName) ? overrideDefaultName : targetAttr.getName(), attrCtxUnder);

        if (addedSimpleRefTraits != null) {
            for (String trait : addedSimpleRefTraits) {
                if (targetAttr.getAppliedTraits().item(trait) == null) {
                    targetAttr.getAppliedTraits().add(trait, true);
                }
            }
        }

        ResolvedTraitSet resTraitSet = targetAttr.fetchResolvedTraits(projCtx.getProjectionDirective().getResOpt());

        // Create deep a copy of traits to avoid conflicts in case of parameters
        if (resTraitSet != null) {
            newResAttr.setResolvedTraits(resTraitSet.deepCopy());
        }

        return newResAttr;
    }
}
