// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmAttribute,
    CdmAttributeContext,
    CdmCorpusContext,
    CdmObject,
    CdmObjectDefinitionBase,
    cdmObjectType,
    cdmOperationType,
    ProjectionAttributeStateSet,
    ProjectionContext,
    ResolvedAttribute,
    ResolvedTraitSet,
    resolveOptions,
    VisitCallback
} from '../../internal';

/**
 * Base class for all operations
 */
export abstract class CdmOperationBase extends CdmObjectDefinitionBase {
    /**
     * The index of an operation
     * In a projection's operation collection, 2 same type of operation may cause duplicate attribute context
     * To avoid that we add an index
     * @internal
     */
    public index: number;

    public type: cdmOperationType;

    constructor(ctx: CdmCorpusContext) {
        super(ctx);
    }

    /**
     * @inheritdoc
     */
    public abstract copy(resOpt?: resolveOptions, host?: CdmObject): CdmObject;

    /**
     * @inheritdoc
     */
    public abstract getName(): string;

    /**
     * @inheritdoc
     */
    public abstract getObjectType(): cdmObjectType;

    /**
     * @inheritdoc
     */
    public abstract isDerivedFrom(base: string, resOpt?: resolveOptions): boolean;

    /**
     * @inheritdoc
     */
    public abstract validate(): boolean;

    /**
     * @inheritdoc
     */
    public abstract visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean;

    /**
     * A function to cumulate the projection attribute states
     * @internal
     */
    public abstract appendProjectionAttributeState(projCtx: ProjectionContext, projAttrStateSet: ProjectionAttributeStateSet, attrCtx: CdmAttributeContext): ProjectionAttributeStateSet;

    /**
     * Projections require a new resolved attribute to be created multiple times
     * This function allows us to create new resolved attributes based on a input attribute
     * @internal
     */
    public static createNewResolvedAttribute(
        projCtx: ProjectionContext,
        attrCtxUnder: CdmAttributeContext,
        targetAttr: CdmAttribute,
        overrideDefaultName: string = null,
        addedSimpleRefTraits: string[] = null
    ): ResolvedAttribute {
        const newResAttr: ResolvedAttribute = new ResolvedAttribute(
            projCtx.projectionDirective.resOpt,
            targetAttr,
            overrideDefaultName ? overrideDefaultName : targetAttr.getName(),
            attrCtxUnder
        );

        if (addedSimpleRefTraits) {
            for (const trait of addedSimpleRefTraits) {
                if (!targetAttr.appliedTraits.item(trait)) {
                    targetAttr.appliedTraits.push(trait, true);
                }
            }
        }

        const resTraitSet: ResolvedTraitSet = targetAttr.fetchResolvedTraits(projCtx.projectionDirective.resOpt);

        // Create deep a copy of traits to avoid conflicts in case of parameters
        if (resTraitSet) {
            newResAttr.resolvedTraits = resTraitSet.deepCopy();
        }

        return newResAttr;
    }
}
