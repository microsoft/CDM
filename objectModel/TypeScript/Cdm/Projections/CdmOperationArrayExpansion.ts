// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    AttributeContextParameters,
    CdmAttribute,
    CdmAttributeContext,
    cdmAttributeContextType,
    CdmCorpusContext,
    cdmLogCode,
    CdmObject,
    cdmObjectType,
    CdmOperationBase,
    cdmOperationType,
    Logger,
    ProjectionAttributeState,
    ProjectionAttributeStateSet,
    ProjectionContext,
    ResolvedAttribute,
    ResolvedAttributeSet,
    resolveOptions,
    StringUtils,
    VisitCallback
} from '../../internal';

/**
 * Class to handle ArrayExpansion operations
 */
export class CdmOperationArrayExpansion extends CdmOperationBase {
    private TAG: string = CdmOperationArrayExpansion.name;

    public startOrdinal?: number;
    public endOrdinal?: number;

    constructor(ctx: CdmCorpusContext) {
        super(ctx);
        this.objectType = cdmObjectType.operationArrayExpansionDef;
        this.type = cdmOperationType.arrayExpansion;
    }

    /**
     * @inheritdoc
     */
    public copy(resOpt?: resolveOptions, host?: CdmObject): CdmObject {
        const copy: CdmOperationArrayExpansion = new CdmOperationArrayExpansion(this.ctx);
        copy.startOrdinal = this.startOrdinal;
        copy.endOrdinal = this.endOrdinal;

        return copy;
    }

    /**
     * @inheritdoc
     */
    public getName(): string {
        return 'operationArrayExpansion';
    }

    /**
     * @inheritdoc
     */
    public getObjectType(): cdmObjectType {
        return cdmObjectType.operationArrayExpansionDef;
    }

    /**
     * @inheritdoc
     */
    public validate(): boolean {
        const missingFields: string[] = [];

        if (this.startOrdinal === undefined || this.startOrdinal === null) {
            missingFields.push('startOrdinal');
        }

        if (this.endOrdinal === undefined || this.endOrdinal === null) {
            missingFields.push('endOrdinal');
        }

        if (missingFields.length > 0) {
            Logger.error(this.ctx, this.TAG, this.validate.name, this.atCorpusPath, cdmLogCode.ErrValdnIntegrityCheckFailure, this.atCorpusPath, missingFields.map((s: string) => `'${s}'`).join(', '));
            return false;
        }

        return true;
    }

    /**
     * @inheritdoc
     */
    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        let path: string = '';
        if (!this.ctx.corpus.blockDeclaredPathChanges) {
            path = this.declaredPath;
            if (!path) {
                path = pathFrom + 'operationArrayExpansion';
                this.declaredPath = path;
            }
        }

        if (preChildren && preChildren(this, path)) {
            return false;
        }

        if (postChildren && postChildren(this, path)) {
            return true;
        }

        return false;
    }

    /**
     * @inheritdoc
     * @internal
     */
    public appendProjectionAttributeState(projCtx: ProjectionContext, projOutputSet: ProjectionAttributeStateSet, attrCtx: CdmAttributeContext): ProjectionAttributeStateSet {
        // Create a new attribute context for the operation
        const attrCtxOpArrayExpansionParam: AttributeContextParameters = {
            under: attrCtx,
            type: cdmAttributeContextType.operationArrayExpansion,
            name: `operation/index${this.index}/operationArrayExpansion`
        };
        const attrCtxOpArrayExpansion: CdmAttributeContext = CdmAttributeContext.createChildUnder(projCtx.projectionDirective.resOpt, attrCtxOpArrayExpansionParam);

        // Expansion steps start at round 0
        let round: number = 0;
        let projAttrStatesFromRounds: ProjectionAttributeState[] = [];

        // Ordinal validation
        if (this.startOrdinal > this.endOrdinal) {
            Logger.warning(this.ctx, this.TAG, this.appendProjectionAttributeState.name, this.atCorpusPath, cdmLogCode.WarnValdnOrdinalStartEndOrder, this.startOrdinal.toString(), this.endOrdinal.toString());
            
        } else {
            // Ordinals should start at startOrdinal or 0, whichever is larger.
            const startingOrdinal: number = Math.max(0, this.startOrdinal);

            // Ordinals should end at endOrdinal or the maximum ordinal allowed (set in resolve options), whichever is smaller.
            if (this.endOrdinal > projCtx.projectionDirective.resOpt.maxOrdinalForArrayExpansion) {
                Logger.warning(this.ctx, this.TAG, this.appendProjectionAttributeState.name, this.atCorpusPath, cdmLogCode.WarnValdnMaxOrdinalTooHigh, this.endOrdinal, projCtx.projectionDirective.resOpt.maxOrdinalForArrayExpansion.toString());
            }
            const endingOrdinal: number = Math.min(projCtx.projectionDirective.resOpt.maxOrdinalForArrayExpansion, this.endOrdinal);

            // For each ordinal, create a copy of the input resolved attribute
            for (let i: number = startingOrdinal; i <= endingOrdinal; i++) {
                // Create a new attribute context for the round
                const attrCtxRoundParam: AttributeContextParameters = {
                    under: attrCtxOpArrayExpansion,
                    type: cdmAttributeContextType.generatedRound,
                    name: `_generatedAttributeRound${round}`
                };
                const attrCtxRound: CdmAttributeContext = CdmAttributeContext.createChildUnder(projCtx.projectionDirective.resOpt, attrCtxRoundParam);

                // Iterate through all the projection attribute states generated from the source's resolved attributes
                // Each projection attribute state contains a resolved attribute that it is corresponding to
                for (const currentPAS of projCtx.currentAttributeStateSet.states) {
                    // Create a new attribute context for the expanded attribute with the current ordinal
                    const attrCtxExpandedAttrParam: AttributeContextParameters = {
                        under: attrCtxRound,
                        type: cdmAttributeContextType.attributeDefinition,
                        name: `${currentPAS.currentResolvedAttribute.resolvedName}@${i}`
                    };
                    const attrCtxExpandedAttr: CdmAttributeContext = CdmAttributeContext.createChildUnder(projCtx.projectionDirective.resOpt, attrCtxExpandedAttrParam);

                    if (currentPAS.currentResolvedAttribute.target instanceof ResolvedAttributeSet) {
                        Logger.error(this.ctx, this.TAG, this.appendProjectionAttributeState.name, this.atCorpusPath, cdmLogCode.ErrProjUnsupportedAttrGroups);
                        projAttrStatesFromRounds = [];
                        break;
                    }

                    // Create a new resolved attribute for the expanded attribute
                    const newResAttr: ResolvedAttribute = CdmOperationBase.createNewResolvedAttribute(projCtx, attrCtxExpandedAttr, currentPAS.currentResolvedAttribute.target as CdmAttribute, currentPAS.currentResolvedAttribute.resolvedName);
                    newResAttr.attCtx.addLineage(currentPAS.currentResolvedAttribute.attCtx);

                    // Create a projection attribute state for the expanded attribute
                    const newPAS: ProjectionAttributeState = new ProjectionAttributeState(projOutputSet.ctx);
                    newPAS.currentResolvedAttribute = newResAttr;
                    newPAS.previousStateList = [ currentPAS ];
                    newPAS.ordinal = i;

                    projAttrStatesFromRounds.push(newPAS);
                }

                if (i === endingOrdinal) {
                    break;
                }

                // Increment the round
                round++;
            }
        }

        if (projAttrStatesFromRounds.length === 0) {
            // No rounds were produced from the array expansion - input passes through
            for (const pas of projCtx.currentAttributeStateSet.states) {
                projOutputSet.add(pas);
            }
        } else {
            // Add all the projection attribute states containing the expanded attributes to the output
            for (const pas of projAttrStatesFromRounds) {
                projOutputSet.add(pas);
            }
        }

        return projOutputSet;
    }
}
