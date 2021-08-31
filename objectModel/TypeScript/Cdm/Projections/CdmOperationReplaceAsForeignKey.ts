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
    cdmLogCode,
    Logger,
    ProjectionAttributeState,
    ProjectionAttributeStateSet,
    ProjectionContext,
    ProjectionResolutionCommonUtil,
    ResolvedAttribute,
    ResolvedTrait,
    resolveOptions,
    VisitCallback,
    StringUtils
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
        if (!resOpt) {
            resOpt = new resolveOptions(this, this.ctx.corpus.defaultResolutionDirectives);
        }

        const copy: CdmOperationReplaceAsForeignKey = !host ? new CdmOperationReplaceAsForeignKey(this.ctx) : host as CdmOperationReplaceAsForeignKey;

        copy.replaceWith = this.replaceWith ? this.replaceWith.copy(resOpt) as CdmTypeAttributeDefinition : undefined;
        copy.reference = this.reference;
        
        this.copyProj(resOpt, copy);
        return copy;
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
            Logger.error(this.ctx, this.TAG, this.validate.name, this.atCorpusPath, cdmLogCode.ErrValdnIntegrityCheckFailure, missingFields.map((s: string) => `'${s}'`).join(', '));
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
        const sourceEntity = projCtx.projectionDirective.originalSourceEntityAttributeName;

        if (!sourceEntity) {
            Logger.warning(projOutputSet.ctx, CdmOperationReplaceAsForeignKey.name, this.createNewProjectionAttributeStateSet.name, null, cdmLogCode.WarnProjFKWithoutSourceEntity, refAttrName);
        }

        if (pasList) {
            // update the new foreign key resolved attribute with trait param with reference details
            const reqdTrait: ResolvedTrait = newResAttrFK.resolvedTraits.find(projCtx.projectionDirective.resOpt, 'is.linkedEntity.identifier');
            if (reqdTrait && sourceEntity) {
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
            Logger.error(projOutputSet.ctx, CdmOperationReplaceAsForeignKey.name, this.createNewProjectionAttributeStateSet.name, null, cdmLogCode.ErrProjRefAttrStateFailure, refAttrName);
        }

        return projOutputSet;
    }
}
