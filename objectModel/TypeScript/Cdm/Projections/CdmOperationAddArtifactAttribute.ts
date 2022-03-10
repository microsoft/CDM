// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    AttributeContextParameters,
    CdmAttributeContext,
    cdmAttributeContextType,
    CdmAttributeItem,
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
    resolveOptions,
    VisitCallback
} from '../../internal';
import { CdmAttributeGroupReference } from '../CdmAttributeGroupReference';
import { CdmEntityAttributeDefinition } from '../CdmEntityAttributeDefinition';
import { CdmTypeAttributeDefinition } from '../CdmTypeAttributeDefinition';

/**
 * Class to handle AddArtifactAttribute operations
 */
export class CdmOperationAddArtifactAttribute extends CdmOperationBase {
    private TAG: string = CdmOperationAddArtifactAttribute.name;

    public newAttribute: CdmAttributeItem;
    public insertAtTop?: boolean;

    constructor(ctx: CdmCorpusContext) {
        super(ctx);
        this.objectType = cdmObjectType.operationAddArtifactAttributeDef;
        this.type = cdmOperationType.addArtifactAttribute;
    }

    /**
     * @inheritdoc
     */
    public copy(resOpt?: resolveOptions, host?: CdmObject): CdmObject {
        if (!resOpt) {
            resOpt = new resolveOptions(this, this.ctx.corpus.defaultResolutionDirectives);
        }

        const copy: CdmOperationAddArtifactAttribute = !host ? new CdmOperationAddArtifactAttribute(this.ctx) : host as CdmOperationAddArtifactAttribute;

        copy.newAttribute = this.newAttribute ? this.newAttribute.copy(resOpt) as CdmAttributeItem : undefined;
        copy.insertAtTop = this.insertAtTop;
        
        this.copyProj(resOpt, copy);
        return copy;
    }

    /**
     * @inheritdoc
     */
    public getName(): string {
        return 'operationAddArtifactAttribute';
    }

    /**
     * @inheritdoc
     */
    public getObjectType(): cdmObjectType {
        return cdmObjectType.operationAddArtifactAttributeDef;
    }

    /**
     * @inheritdoc
     */
    public validate(): boolean {
        const missingFields: string[] = [];

        if (!this.newAttribute) {
            missingFields.push('newAttribute');
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

        if (this.newAttribute !== undefined && this.newAttribute.visit(`${path}/newAttribute/`, preChildren, postChildren)) {
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
    public appendProjectionAttributeState(projCtx: ProjectionContext, projOutputSet: ProjectionAttributeStateSet, attrCtx: CdmAttributeContext): ProjectionAttributeStateSet {
        if (this.insertAtTop != true) {
            this.addAllPreviousAttributeStates(projCtx, projOutputSet);
            this.addNewArtifactAttributeState(projCtx, projOutputSet, attrCtx);
        } else {
            this.addNewArtifactAttributeState(projCtx, projOutputSet, attrCtx);
            this.addAllPreviousAttributeStates(projCtx, projOutputSet);
        }

        return projOutputSet;
    }
    
    private addNewArtifactAttributeState(projCtx: ProjectionContext, projOutputSet: ProjectionAttributeStateSet, attrCtx: CdmAttributeContext): ProjectionAttributeStateSet {
        // Create a new attribute context for the operation
        const attrCtxOpAddAttrGroupParam: AttributeContextParameters = {
            under: attrCtx,
            type: cdmAttributeContextType.operationAddArtifactAttribute,
            name: `operation/index${this.index}/${this.getName()}`
        };
        const attrCtxOpAddArtifactAttr: CdmAttributeContext = CdmAttributeContext.createChildUnder(projCtx.projectionDirective.resOpt, attrCtxOpAddAttrGroupParam);

        if (this.newAttribute instanceof CdmTypeAttributeDefinition) {
            // Create a new attribute context for the new artifact attribute we will create
            const attrCtxAttrGroupParam: AttributeContextParameters = {
                under: attrCtxOpAddArtifactAttr,
                type: cdmAttributeContextType.addedAttributeNewArtifact,
                name: this.newAttribute.fetchObjectDefinitionName()
            };
            const attrCtxNewAttr: CdmAttributeContext = CdmAttributeContext.createChildUnder(projCtx.projectionDirective.resOpt, attrCtxAttrGroupParam);
            const newResAttr = CdmOperationBase.createNewResolvedAttribute(projCtx, attrCtxNewAttr, this.newAttribute);
    
            // Create a new projection attribute state for the new artifact attribute and add it to the output set
            // There is no previous state for the newly created attribute
            const newPAS: ProjectionAttributeState = new ProjectionAttributeState(projOutputSet.ctx);
            newPAS.currentResolvedAttribute = newResAttr;
            
            projOutputSet.add(newPAS);
        } else if (this.newAttribute instanceof CdmEntityAttributeDefinition || this.newAttribute instanceof CdmAttributeGroupReference) {
            const typeStr: string = this.newAttribute instanceof CdmEntityAttributeDefinition ? 'an entity attribute' : 'an attribute group';
            Logger.warning(this.ctx, this.TAG, this.appendProjectionAttributeState.name, this.atCorpusPath, cdmLogCode.WarnProjAddArtifactAttrNotSupported, typeStr);
        } else {
            Logger.warning(this.ctx, this.TAG, this.appendProjectionAttributeState.name, this.atCorpusPath, cdmLogCode.ErrProjUnsupportedSource, this.newAttribute.objectType.toString(), this.getName());
        }


        return projOutputSet;
    }

    /**
     * Pass through all the input projection attribute states if there are any.
     */
    private addAllPreviousAttributeStates(projCtx: ProjectionContext, projOutputSet: ProjectionAttributeStateSet): void {
        // Pass through all the input projection attribute states if there are any
        for (const currentPAS of projCtx.currentAttributeStateSet.states) {
            projOutputSet.add(currentPAS);
        }
    }
}
