// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmAttributeContext,
    cdmAttributeContextType,
    CdmCorpusContext,
    CdmEntityReference,
    CdmObject,
    cdmObjectType,
    CdmOperationBase,
    cdmOperationType,
    CdmTypeAttributeDefinition,
    Errors,
    Logger,
    ProjectionAttributeState,
    ProjectionAttributeStateSet,
    ProjectionContext,
    ProjectionResolutionCommonUtil,
    ResolvedAttribute,
    ResolvedTrait,
    resolveOptions,
    VisitCallback
} from '../../internal';
import { AttributeContextParameters } from '../../Utilities/AttributeContextParameters';

/**
 * Class to handle ReplaceAsForeignKey operations
 */
export class CdmOperationReplaceAsForeignKey extends CdmOperationBase {
    private TAG: string = CdmOperationReplaceAsForeignKey.name;
    public reference: string;
    public replaceWith: CdmTypeAttributeDefinition;

    constructor(ctx: CdmCorpusContext) {
        super(ctx);
        this.objectType = cdmObjectType.operationReplaceAsForeignKeyDef;
        this.type = cdmOperationType.replaceAsForeignKey;
    }

    /**
     * @inheritdoc
     */
    public copy(resOpt?: resolveOptions, host?: CdmObject): CdmObject {
        Logger.error(this.TAG, this.ctx, 'Projection operation not implemented yet.', this.copy.name);
        return new CdmOperationReplaceAsForeignKey(this.ctx);
    }

    /**
     * @inheritdoc
     */
    public getName(): string {
        return 'operationReplaceAsForeignKey';
    }

    /**
     * @inheritdoc
     */
    public getObjectType(): cdmObjectType {
        return cdmObjectType.operationReplaceAsForeignKeyDef;
    }

    /**
     * @inheritdoc
     */
    public validate(): boolean {
        const missingFields: string[] = [];

        if (!this.reference) {
            missingFields.push('reference');
        }

        if (!this.replaceWith) {
            missingFields.push('replaceWith');
        }

        if (missingFields.length > 0) {
            Logger.error(
                this.TAG,
                this.ctx,
                Errors.validateErrorString(this.atCorpusPath, missingFields),
                this.validate.name
            );

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
                path = pathFrom + 'operationReplaceAsForeignKey';
                this.declaredPath = path;
            }
        }

        if (preChildren && preChildren(this, path)) {
            return false;
        }

        if (this.replaceWith) {
            if (this.replaceWith.visit(pathFrom + 'foreignKeyAttribute/', preChildren, postChildren)) {
                return true;
            }
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
    public appendProjectionAttributeState(
        projCtx: ProjectionContext,
        projOutputSet: ProjectionAttributeStateSet,
        attrCtx: CdmAttributeContext
    ): ProjectionAttributeStateSet {
        // Create new attribute context for the operation
        const attrCtxOpFKParam: AttributeContextParameters = {
            under: attrCtx,
            type: cdmAttributeContextType.operationReplaceAsForeignKey,
            name: `operation/index${this.index}/operationReplaceAsForeignKey`
        };
        const attrCtxOpFK: CdmAttributeContext = CdmAttributeContext.createChildUnder(projCtx.projectionDirective.resOpt, attrCtxOpFKParam);

        // Create new attribute context for the AddedAttributeIdentity
        const attrCtxFKParam: AttributeContextParameters  = {
            under: attrCtxOpFK,
            type: cdmAttributeContextType.addedAttributeIdentity,
            name: '_foreignKey'
        };
        const attrCtxFK: CdmAttributeContext = CdmAttributeContext.createChildUnder(projCtx.projectionDirective.resOpt, attrCtxFKParam);

        // get the added attribute and applied trait
        // the name here will be {m} and not {A}{o}{M} - should this map to the not projections approach and default to {A}{o}{M} - ???
        const subFK: CdmTypeAttributeDefinition = this.replaceWith;
        const addTrait: string[] = ['is.linkedEntity.identifier'];

        // Create new resolved attribute, set the new attribute as target, and apply "is.linkedEntity.identifier" trait
        const resAttrNewFK: ResolvedAttribute = CdmOperationBase.createNewResolvedAttribute(projCtx, attrCtxFK, subFK, undefined, addTrait);

        const outputFromOpPasSet: ProjectionAttributeStateSet = CdmOperationReplaceAsForeignKey.createNewProjectionAttributeStateSet(projCtx, projOutputSet, resAttrNewFK, this.reference);

        return outputFromOpPasSet;
    }

    private static createNewProjectionAttributeStateSet(
        projCtx: ProjectionContext,
        projOutputSet: ProjectionAttributeStateSet,
        newResAttrFK: ResolvedAttribute,
        refAttrName: string
    ): ProjectionAttributeStateSet {
        const pasList: ProjectionAttributeState[] = ProjectionResolutionCommonUtil.getLeafList(projCtx, refAttrName);

        if (pasList) {
            // update the new foreign key resolved attribute with trait param with reference details
            const reqdTrait: ResolvedTrait = newResAttrFK.resolvedTraits.find(projCtx.projectionDirective.resOpt, 'is.linkedEntity.identifier');
            if (reqdTrait) {
                const traitParamEntRef: CdmEntityReference = ProjectionResolutionCommonUtil.createForeignKeyLinkedEntityIdentifierTraitParameter(projCtx.projectionDirective, projOutputSet.ctx.corpus, pasList);
                reqdTrait.parameterValues.setParameterValue(projCtx.projectionDirective.resOpt, 'entityReferences', traitParamEntRef);
            }

            // Create new output projection attribute state set for FK and add prevPas as previous state set
            const newProjAttrStateFK: ProjectionAttributeState = new ProjectionAttributeState(projOutputSet.ctx);
            newProjAttrStateFK.currentResolvedAttribute = newResAttrFK;
            newProjAttrStateFK.previousStateList = pasList;

            projOutputSet.add(newProjAttrStateFK);
        } else {
            // Log error & return projOutputSet without any change
            Logger.error(CdmOperationReplaceAsForeignKey.name, projOutputSet.ctx, `Unable to locate state for reference attribute \"${refAttrName}\".`, this.createNewProjectionAttributeStateSet.name);
        }

        return projOutputSet;
    }
}
