// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    AttributeContextParameters,
    CdmAttributeContext,
    cdmAttributeContextType,
    CdmCorpusContext,
    cdmLogCode,
    CdmObject,
    cdmObjectType,
    CdmOperationBase,
    cdmOperationType,
    CdmTypeAttributeDefinition,
    Logger,
    ProjectionAttributeState,
    ProjectionAttributeStateSet,
    ProjectionContext,
    ResolvedAttribute,
    resolveOptions,
    StringUtils,
    VisitCallback
} from '../../internal';

/**
 * Class to handle AddCountAttribute operations
 */
export class CdmOperationAddCountAttribute extends CdmOperationBase {
    private TAG: string = CdmOperationAddCountAttribute.name;

    public countAttribute: CdmTypeAttributeDefinition;

    constructor(ctx: CdmCorpusContext) {
        super(ctx);
        this.objectType = cdmObjectType.operationAddCountAttributeDef;
        this.type = cdmOperationType.addCountAttribute;
    }

    /**
     * @inheritdoc
     */
     public copy(resOpt?: resolveOptions, host?: CdmObject): CdmObject {
        if (!resOpt) {
            resOpt = new resolveOptions(this, this.ctx.corpus.defaultResolutionDirectives);
        }

        const copy: CdmOperationAddCountAttribute = !host ? new CdmOperationAddCountAttribute(this.ctx) : host as CdmOperationAddCountAttribute;

        copy.countAttribute = this.countAttribute ? this.countAttribute.copy(resOpt) as CdmTypeAttributeDefinition : undefined;
        
        this.copyProj(resOpt, copy);
        return copy;
    }

    /**
     * @inheritdoc
     */
    public getName(): string {
        return 'operationAddCountAttribute';
    }

    /**
     * @inheritdoc
     */
    public getObjectType(): cdmObjectType {
        return cdmObjectType.operationAddCountAttributeDef;
    }

    /**
     * @inheritdoc
     */
    public validate(): boolean {
        const missingFields: string[] = [];

        if (!this.countAttribute) {
            missingFields.push('countAttribute');
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
        const path = this.fetchDeclaredPath(pathFrom);

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
        // Pass through all the input projection attribute states if there are any
        for (const currentPAS of projCtx.currentAttributeStateSet.states) {
            projOutputSet.add(currentPAS);
        }

        // Create a new attribute context for the operation
        const attrCtxOpAddCountParam: AttributeContextParameters = {
            under: attrCtx,
            type: cdmAttributeContextType.operationAddCountAttribute,
            name: `operation/index${this.index}/operationAddCountAttribute`
        };
        const attrCtxOpAddCount: CdmAttributeContext = CdmAttributeContext.createChildUnder(projCtx.projectionDirective.resOpt, attrCtxOpAddCountParam);

        // Create a new attribute context for the Count attribute we will create
        const attrCtxCountAttrParam: AttributeContextParameters = {
            under: attrCtxOpAddCount,
            type: cdmAttributeContextType.addedAttributeExpansionTotal,
            name: this.countAttribute.name
        };
        const attrCtxCountAttr: CdmAttributeContext = CdmAttributeContext.createChildUnder(projCtx.projectionDirective.resOpt, attrCtxCountAttrParam);

        // Create the Count attribute with the specified CountAttribute as its target and apply the trait "is.linkedEntity.array.count" to it
        const addTrait: string[] = ['is.linkedEntity.array.count'];
        const newResAttr: ResolvedAttribute = CdmOperationBase.createNewResolvedAttribute(projCtx, attrCtxCountAttr, this.countAttribute, undefined, addTrait);

        // Create a new projection attribute state for the new Count attribute and add it to the output set
        // There is no previous state for the newly created Count attribute
        const newPAS: ProjectionAttributeState = new ProjectionAttributeState(projOutputSet.ctx);
        newPAS.currentResolvedAttribute = newResAttr;

        projOutputSet.add(newPAS);

        return projOutputSet;
    }
}
