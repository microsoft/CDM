// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    AttributeContextParameters,
    CdmAttributeContext,
    cdmAttributeContextType,
    CdmCorpusContext,
    CdmObject,
    cdmObjectType,
    CdmOperationBase,
    cdmOperationType,
    CdmTraitReference,
    CdmTypeAttributeDefinition,
    cdmLogCode,
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
 * Class to handle AddSupportingAttribute operations
 */
export class CdmOperationAddSupportingAttribute extends CdmOperationBase {
    public supportingAttribute: CdmTypeAttributeDefinition;

    private readonly TAG: string = CdmOperationAddSupportingAttribute.name;

    constructor(ctx: CdmCorpusContext) {
        super(ctx);
        this.objectType = cdmObjectType.operationAddSupportingAttributeDef;
        this.type = cdmOperationType.addSupportingAttribute;
    }

    /**
     * @inheritdoc
     */
     public copy(resOpt?: resolveOptions, host?: CdmObject): CdmObject {
        if (!resOpt) {
            resOpt = new resolveOptions(this, this.ctx.corpus.defaultResolutionDirectives);
        }

        const copy: CdmOperationAddSupportingAttribute = !host ? new CdmOperationAddSupportingAttribute(this.ctx) : host as CdmOperationAddSupportingAttribute;

        copy.supportingAttribute = this.supportingAttribute ? this.supportingAttribute.copy(resOpt) as CdmTypeAttributeDefinition : undefined;
        
        this.copyProj(resOpt, copy);
        return copy;
    }

    /**
     * @inheritdoc
     */
    public getName(): string {
        return 'operationAddSupportingAttribute';
    }

    /**
     * @inheritdoc
     */
    public getObjectType(): cdmObjectType {
        return cdmObjectType.operationAddSupportingAttributeDef;
    }

    /**
     * @inheritdoc
     */
    public validate(): boolean {
        const missingFields: string[] = [];

        if (!this.supportingAttribute) {
            missingFields.push('supportingAttribute');
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

        if (this.supportingAttribute !== undefined && this.supportingAttribute.visit(`${path}/supportingAttribute/`, preChildren, postChildren)) {
            return true;
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
    public appendProjectionAttributeState(projCtx: ProjectionContext,
                                          projOutputSet: ProjectionAttributeStateSet,
                                          attrCtx: CdmAttributeContext): ProjectionAttributeStateSet {
        // Pass through all the input projection attribute states if there are any
        for (const currentPAS of projCtx.currentAttributeStateSet.states) {
            projOutputSet.add(currentPAS);
        }

        // Create a new attribute context for the operation
        const attrCtxOpAddSupportingAttrParam: AttributeContextParameters = {
            under: attrCtx,
            type: cdmAttributeContextType.operationAddSupportingAttribute,
            name: `operation/index${this.index}/${this.getName()}`
        };
        const attrCtxOpAddSupportingAttr: CdmAttributeContext = CdmAttributeContext
            .createChildUnder(projCtx.projectionDirective.resOpt, attrCtxOpAddSupportingAttrParam);

        // Create a new attribute context for the supporting attribute we will create
        const attrCtxSupportingAttrParam: AttributeContextParameters = {
            under: attrCtxOpAddSupportingAttr,
            type: cdmAttributeContextType.addedAttributeSupporting,
            name: this.supportingAttribute.name
        };
        const attrCtxSupportingAttr: CdmAttributeContext = CdmAttributeContext
            .createChildUnder(projCtx.projectionDirective.resOpt, attrCtxSupportingAttrParam);

        // TODO: this if statement keeps the functionality the same way it works currently in resolution guidance.
        // This should be changed to point to the foreign key attribute instead. 
        // There has to be some design decisions about how this will work and will be done in the next release.
        if (projCtx.currentAttributeStateSet.states.length > 0) {
            const lastIndex: number = projCtx.currentAttributeStateSet.states.length - 1;
            const lastState: ProjectionAttributeState = projCtx.currentAttributeStateSet.states[lastIndex];
            const inSupportOfTrait: CdmTraitReference = this.supportingAttribute.appliedTraits.push('is.addedInSupportOf') as CdmTraitReference;
            inSupportOfTrait.arguments.push('inSupportOf', lastState.currentResolvedAttribute.resolvedName);
        }

        // Create the supporting attribute with the specified 'supportingAttribute' property as its target 
        // and apply the trait 'is.virtual.attribute' to it
        const addTrait: string[] = ['is.virtual.attribute'];
        const newResAttr: ResolvedAttribute =
            CdmOperationBase.createNewResolvedAttribute(projCtx, attrCtxSupportingAttr, this.supportingAttribute, null, addTrait);

        // Create a new projection attribute state for the new supporting attribute and add it to the output set
        // There is no previous state for the newly created supporting attribute
        const newPAS: ProjectionAttributeState = new ProjectionAttributeState(projOutputSet.ctx);
        newPAS.currentResolvedAttribute = newResAttr;

        projOutputSet.add(newPAS);

        return projOutputSet;
    }
}
