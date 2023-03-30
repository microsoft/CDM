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
    CdmTraitReference,
    ProjectionAttributeState,
    ProjectionAttributeStateSet,
    ProjectionContext,
    ResolvedAttribute,
    ResolvedTraitSet,
    resolveOptions,
    StringUtils,
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

    /***
     * Property of an operation that holds the condition expression string
     */
    public condition?: string;

    /**
     * Property of an operation that defines if the operation receives the input from previous operation or from source entity
     */
    public sourceInput?: boolean;

    public type: cdmOperationType;

    constructor(ctx: CdmCorpusContext) {
        super(ctx);
    }

    /**
     * @internal
     */
    copyProj(resOpt: resolveOptions, copy: CdmOperationBase): CdmOperationBase {
        copy.type = this.type;
        copy.index = this.index;
        copy.condition = this.condition;
        copy.sourceInput = this.sourceInput;

        this.copyDef(resOpt, copy);
        return copy;
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
    public isDerivedFrom(base: string, resOpt?: resolveOptions): boolean {
        return false;
    }

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
        target_attr_or_resolved_attr: CdmAttribute | ResolvedAttribute,
        overrideDefaultName: string = undefined,
        addedSimpleRefTraits: string[] = undefined
    ): ResolvedAttribute {

        const targetAttr: CdmAttribute = target_attr_or_resolved_attr instanceof CdmAttribute 
                                            ? target_attr_or_resolved_attr.copy() as CdmAttribute 
                                            : (target_attr_or_resolved_attr.target as CdmAttribute).copy() as CdmAttribute;

        const newResAttr: ResolvedAttribute = new ResolvedAttribute(
            projCtx.projectionDirective.resOpt,
            targetAttr,
            overrideDefaultName ? overrideDefaultName : targetAttr.getName(),
            attrCtxUnder
        );
        targetAttr.inDocument = projCtx.projectionDirective.owner.inDocument;

        if (target_attr_or_resolved_attr instanceof CdmAttribute) {
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
        } else {
            newResAttr.resolvedTraits = target_attr_or_resolved_attr.resolvedTraits.deepCopy();

            if (addedSimpleRefTraits) {
                for (const trait of addedSimpleRefTraits) {
                    const traitReference = new CdmTraitReference(targetAttr.ctx, trait, true, false);
                    newResAttr.resolvedTraits = newResAttr.resolvedTraits.mergeSet(traitReference.fetchResolvedTraits());
                }
            }
        }

        return newResAttr;
    }


    /**
     * Replace the wildcard character. {a/A} will be replaced with the current attribute's original name. 
     * {m/M} will be replaced with the attribute name of the projection owner. 
     * {mo/Mo} will be replaced with the current attribute's resolved name.
     * {o} will be replaced with the index of the attribute after an array expansion.
     * @internal
     */
        public static replaceWildcardCharacters(
            format: string,
            projectionOwnerName: string,
            currentPAS: ProjectionAttributeState
        ): string {
            if (!format) {
                return ''
            }

            const ordinal: string = currentPAS.ordinal !== undefined ? currentPAS.ordinal.toString() : "";
            const originalMemberAttributeName: string = (currentPAS.currentResolvedAttribute.target as CdmAttribute)?.name ?? "";
            const resolvedMemberAttributeName: string = currentPAS.currentResolvedAttribute.resolvedName ?? "";
            
            let value: string = StringUtils.replace(format, 'a', projectionOwnerName);
            value = StringUtils.replace(value, 'o', ordinal);
            value = StringUtils.replace(value, 'mo', originalMemberAttributeName);
            value = StringUtils.replace(value, 'm', resolvedMemberAttributeName);

            return value;
        }

}
