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
 * Class to handle AddTypeAttribute operations
 */
export class CdmOperationAddTypeAttribute extends CdmOperationBase {
    private TAG: string = CdmOperationAddTypeAttribute.name;

    public typeAttribute: CdmTypeAttributeDefinition;

    constructor(ctx: CdmCorpusContext) {
        super(ctx);
        this.objectType = cdmObjectType.operationAddTypeAttributeDef;
        this.type = cdmOperationType.addTypeAttribute;
    }

    /**
     * @inheritdoc
     */
     public copy(resOpt?: resolveOptions, host?: CdmObject): CdmObject {
        if (!resOpt) {
            resOpt = new resolveOptions(this, this.ctx.corpus.defaultResolutionDirectives);
        }

        let copy: CdmOperationAddTypeAttribute = !host ? new CdmOperationAddTypeAttribute(this.ctx) : host as CdmOperationAddTypeAttribute;

        copy.typeAttribute = this.typeAttribute ? this.typeAttribute.copy(resOpt) as CdmTypeAttributeDefinition : undefined;
        
        this.copyProj(resOpt, copy);
        return copy;
    }

    /**
     * @inheritdoc
     */
    public getName(): string {
        return 'operationAddTypeAttribute';
    }

    /**
     * @inheritdoc
     */
    public getObjectType(): cdmObjectType {
        return cdmObjectType.operationAddTypeAttributeDef;
    }

    /**
     * @inheritdoc
     */
    public validate(): boolean {
        const missingFields: string[] = [];

        if (!this.typeAttribute) {
            missingFields.push('typeAttribute');
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
        const attrCtxOpAddTypeParam: AttributeContextParameters = {
            under: attrCtx,
            type: cdmAttributeContextType.operationAddTypeAttribute,
            name: `operation/index${this.index}/operationAddTypeAttribute`
        };
        const attrCtxOpAddType: CdmAttributeContext = CdmAttributeContext.createChildUnder(projCtx.projectionDirective.resOpt, attrCtxOpAddTypeParam);

        // Create a new attribute context for the Type attribute we will create
        const attrCtxTypeAttrParam: AttributeContextParameters = {
            under: attrCtxOpAddType,
            type: cdmAttributeContextType.addedAttributeSelectedType,
            name: '_selectedEntityName'
        };
        const attrCtxTypeAttr: CdmAttributeContext = CdmAttributeContext.createChildUnder(projCtx.projectionDirective.resOpt, attrCtxTypeAttrParam);

        // Create the Type attribute with the specified "typeAttribute" (from the operation) as its target and apply the trait "is.linkedEntity.name" to it
        const addTrait: string[] = ['is.linkedEntity.name'];
        const newResAttr: ResolvedAttribute = CdmOperationBase.createNewResolvedAttribute(projCtx, attrCtxTypeAttr, this.typeAttribute, undefined, addTrait);

        // Create a new projection attribute state for the new Type attribute and add it to the output set
        // There is no previous state for the newly created Type attribute
        const newPAS: ProjectionAttributeState = new ProjectionAttributeState(projOutputSet.ctx);
        newPAS.currentResolvedAttribute = newResAttr;

        projOutputSet.add(newPAS);

        return projOutputSet;
    }
}
